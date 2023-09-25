import { type ResourceOwner } from "@keybr/oauth";
import {
  type AnonymousUser,
  type AnyUser,
  type NamedUser,
  type OrderDetails,
  type UserDetails,
  type UserExternalIdDetails,
} from "@keybr/pages-shared";
import { PublicId } from "@keybr/publicid";
import { type Knex } from "knex";
import { type JSONSchema, Model, type Pojo, snakeCaseMappers } from "objection";
import { anonymousName } from "./name.ts";
import { Random } from "./util.ts";

export function TimestampMixin(superClass: typeof Model): typeof Model {
  return class extends superClass implements Model {
    createdAt?: Date;

    override $beforeInsert(): void {
      if (this.createdAt == null) {
        this.createdAt = new Date();
      }
    }
  };
}

export class User extends TimestampMixin(Model) {
  static override readonly tableName = "user";
  static override readonly columnNameMappers = snakeCaseMappers();
  static override jsonSchema = {
    type: "object",
    required: ["email", "name"],
    properties: {
      id: { type: "integer" },
      email: { type: "string", minLength: 1, maxLength: 64 },
      name: { type: "string", minLength: 1, maxLength: 32 },
    },
  } satisfies JSONSchema;

  static createTable(knex: Knex, table: Knex.CreateTableBuilder) {
    const { email, name } = User.jsonSchema.properties;
    table.increments("id").primary();
    table.string("email", email.maxLength).notNullable();
    table.string("name", name.maxLength).notNullable();
    table.boolean("anonymized").notNullable().defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["email"]);
    table.unique(["name"]);
  }

  readonly id?: number;
  email?: string;
  name?: string;
  anonymized?: number;
  createdAt?: Date;
  externalIds?: UserExternalId[];
  order?: Order;

  static async loadProfileOwner(publicId: PublicId): Promise<NamedUser | null> {
    if (publicId.example) {
      return publicId.toUser();
    }
    const user = await User.findById(publicId.id);
    if (user != null) {
      return User.toPublicUser(user, 0);
    }
    return null;
  }

  static async findById(id: number): Promise<User | null> {
    return (
      (await User.query() //
        .withGraphFetched("externalIds")
        .withGraphFetched("order")
        .findOne({ id })) ?? null
    );
  }

  static async findByEmail(email: string): Promise<User | null> {
    return (
      (await User.query() //
        .withGraphFetched("externalIds")
        .withGraphFetched("order")
        .findOne({ email })) ?? null
    );
  }

  static async loadAll(id: number[]): Promise<Map<number, User>> {
    return new Map<number, User>(
      (
        await User.query() //
          .withGraphFetched("externalIds")
          .withGraphFetched("order")
          .findByIds(id)
      ).map((user) => [user.id!, user]),
    );
  }

  static async login(email: string): Promise<User> {
    let user = await User.findByEmail(email);
    if (user == null) {
      const name = await User.findUniqueName(email, email);
      user = await User.query()
        .withGraphFetched("externalIds")
        .withGraphFetched("order")
        .insertAndFetch({ email, name });
    }
    return user;
  }

  static async findUniqueName(
    email: string | null,
    hint: string,
  ): Promise<string> {
    for (const candidate of candidates(hint)) {
      if (!(await User.nameExists(email, candidate))) {
        return candidate;
      }
    }
    throw new Error(); // Unreachable.

    function* candidates(hint: string, length: number = 32): Iterable<string> {
      let name = hint;
      const pos = hint.indexOf("@");
      if (pos !== -1) {
        name = hint.substring(0, pos);
      }
      name = name.substring(0, length);
      // Try original name.
      yield name;
      // Try name with numeric suffix.
      for (let index = 0; index < 10; index++) {
        const suffix = String(index + 1);
        yield name.substring(0, length - suffix.length) + suffix;
      }
      // Try name with random suffix.
      for (let index = 0; index < 10; index++) {
        const suffix = Random.string(10);
        yield name.substring(0, length - suffix.length) + suffix;
      }
    }
  }

  static async nameExists(
    email: string | null,
    name: string,
  ): Promise<boolean> {
    if (email != null) {
      return (await User.query().whereNot({ email }).findOne({ name })) != null;
    } else {
      return (await User.query().findOne({ name })) != null;
    }
  }

  static async ensure(ro: ResourceOwner): Promise<User> {
    ro = User.parseResourceOwner(ro);
    const { email } = ro;
    if (email == null) {
      throw new Error("No email address");
    }
    const user = await User.findByEmail(email);
    const model = await User.merge(user, ro, email);
    return await User.query().upsertGraphAndFetch(model);
  }

  static parseResourceOwner(ro: ResourceOwner): ResourceOwner {
    const emailType = User.jsonSchema.properties.email;
    const nameType = User.jsonSchema.properties.name;
    const urlType = UserExternalId.jsonSchema.properties.url;
    const imageUrlType = UserExternalId.jsonSchema.properties.imageUrl;
    let { raw, provider, id, email, name, url, imageUrl } = ro;
    if (email != null && email.length > emailType.maxLength) {
      email = null;
    }
    if (name != null && name.length > nameType.maxLength) {
      name = name.substring(0, nameType.maxLength);
    }
    if (url != null && url.length > urlType.maxLength) {
      url = null;
    }
    if (imageUrl != null && imageUrl.length > imageUrlType.maxLength) {
      imageUrl = null;
    }
    return { raw, provider, id, email, name, url, imageUrl };
  }

  static async merge(
    user: User | null,
    ro: ResourceOwner,
    email: string,
  ): Promise<Partial<User>> {
    let name: string;
    if (user != null && ro.name == null) {
      name = user.name!;
    } else {
      name = await User.findUniqueName(email, ro.name ?? email);
    }

    const externalIds = new Map(
      (user?.externalIds ?? []).map((id) => [id.provider!, id]),
    );

    externalIds.set(ro.provider, {
      ...externalIds.get(ro.provider),
      provider: ro.provider,
      externalId: ro.id,
      name: ro.name ?? undefined,
      url: ro.url ?? undefined,
      imageUrl: ro.imageUrl ?? undefined,
    } as UserExternalId);

    return {
      ...user,
      email: ro.email,
      name,
      externalIds: [...externalIds.values()],
    } as User;
  }

  toDetails(): UserDetails {
    return {
      id: String(new PublicId(this.id!)),
      email: this.email!,
      name: this.name!,
      anonymized: Boolean(this.anonymized!),
      externalId: this.externalIds!.map((id) => id.toDetails()),
      order: this.order?.toDetails() ?? null,
      createdAt: this.createdAt!,
    };
  }

  static toPublicUser(user: null, hint: number | string): AnonymousUser;
  static toPublicUser(user: User, hint: number | string): NamedUser;
  static toPublicUser(user: User | null, hint: number | string): AnyUser;
  static toPublicUser(user: User | null, hint: number | string): AnyUser {
    if (user != null) {
      // Handle authenticated user.
      const details = user.toDetails();
      const premium = details.order != null;
      if (user.anonymized) {
        return Object.freeze<NamedUser>({
          id: details.id,
          name: anonymousName(details.email),
          imageUrl: null,
          premium,
        });
      }
      const [externalId = null] = details.externalId;
      if (externalId != null) {
        // Try to take username from an external id, if exists.
        return Object.freeze<NamedUser>({
          id: details.id,
          name: externalId.name ?? details.name,
          imageUrl: externalId.imageUrl,
          premium,
        });
      } else {
        // Otherwise use auto-generated username.
        return Object.freeze<NamedUser>({
          id: details.id,
          name: details.name,
          imageUrl: null,
          premium,
        });
      }
    } else {
      // Handle anonymous user.
      return Object.freeze<AnonymousUser>({
        id: null,
        name: anonymousName(hint),
        imageUrl: null,
      });
    }
  }
}

export class UserExternalId extends TimestampMixin(Model) {
  static override readonly tableName = "user_external_id";
  static override readonly columnNameMappers = snakeCaseMappers();
  static override jsonSchema = {
    type: "object",
    required: ["provider", "externalId"],
    properties: {
      id: { type: "integer" },
      provider: { type: "string", minLength: 1, maxLength: 16 },
      externalId: { type: "string", minLength: 1, maxLength: 32 },
      name: { type: ["null", "string"], minLength: 1, maxLength: 64 },
      url: { type: ["null", "string"], minLength: 1, maxLength: 256 },
      imageUrl: { type: ["null", "string"], minLength: 1, maxLength: 256 },
    },
  } satisfies JSONSchema;

  static createTable(knex: Knex, table: Knex.CreateTableBuilder) {
    const { provider, externalId, name, url, imageUrl } =
      UserExternalId.jsonSchema.properties;
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("provider", provider.maxLength).notNullable();
    table.string("external_id", externalId.maxLength).notNullable();
    table.string("name", name.maxLength).nullable();
    table.string("url", url.maxLength).nullable();
    table.string("image_url", imageUrl.maxLength).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "provider"]);
    table.unique(["provider", "external_id"]);
  }

  readonly id?: number;
  provider?: string;
  externalId?: string;
  name?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  createdAt?: Date;
  user?: User;

  toDetails(): UserExternalIdDetails {
    return {
      provider: this.provider!,
      id: this.externalId!,
      name: this.name ?? null,
      url: this.url ?? null,
      imageUrl: this.imageUrl ?? null,
      createdAt: this.createdAt!,
    };
  }
}

export class Order extends TimestampMixin(Model) {
  static override readonly tableName = "order";
  static override readonly columnNameMappers = snakeCaseMappers();
  static override jsonSchema = {
    type: "object",
    required: ["id", "provider"],
    properties: {
      id: { type: "string", minLength: 1, maxLength: 100 },
      provider: { type: "string", minLength: 1, maxLength: 30 },
      name: { type: ["null", "string"], minLength: 1, maxLength: 100 },
      email: { type: ["null", "string"], minLength: 1, maxLength: 100 },
    },
  } satisfies JSONSchema;

  static createTable(knex: Knex, table: Knex.CreateTableBuilder) {
    const { id, provider, name, email } = Order.jsonSchema.properties;
    table.string("id", id.maxLength).primary();
    table.string("provider", provider.maxLength).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("name", name.maxLength).nullable();
    table.string("email", email.maxLength).nullable();
    table.unique(["user_id"]);
  }

  readonly id?: string;
  provider?: string;
  name?: string | null;
  email?: string | null;
  createdAt?: Date;
  user?: User;

  toDetails(): OrderDetails {
    return {
      id: this.id!,
      provider: this.provider!,
      name: this.name ?? null,
      email: this.email ?? null,
      createdAt: this.createdAt!,
    };
  }
}

export class UserLoginRequest extends TimestampMixin(Model) {
  static override readonly tableName = "user_login_request";
  static override readonly columnNameMappers = snakeCaseMappers();
  static override jsonSchema = {
    type: "object",
    required: ["email", "accessToken"],
    properties: {
      id: { type: "integer" },
      email: { type: "string", minLength: 1, maxLength: 64 },
      accessToken: { type: "string", minLength: 1, maxLength: 64 },
    },
  } satisfies JSONSchema;

  static createTable(knex: Knex, table: Knex.CreateTableBuilder) {
    const { email, accessToken } = UserLoginRequest.jsonSchema.properties;
    table.increments("id").primary();
    table.string("email", email.maxLength).notNullable();
    table.binary("access_token", accessToken.maxLength).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["email"]);
    table.unique(["access_token"]);
  }

  static readonly expireTime = 24 * 3600 * 1000;

  readonly id?: number;
  email?: string;
  accessToken?: string;
  createdAt?: Date;

  override $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json);
    if (json.accessToken != null) {
      json.accessToken = Buffer.from(json.accessToken);
    }
    return json;
  }

  override $parseDatabaseJson(json: Pojo): Pojo {
    json = super.$parseDatabaseJson(json);
    if (json.accessToken != null) {
      json.accessToken = String(json.accessToken);
    }
    return json;
  }

  static async findById(id: number): Promise<UserLoginRequest | null> {
    return (await UserLoginRequest.query().findOne({ id })) ?? null;
  }

  static async findByEmail(email: string): Promise<UserLoginRequest | null> {
    return (await UserLoginRequest.query().findOne({ email })) ?? null;
  }

  static async findByAccessToken(
    accessToken: string,
  ): Promise<UserLoginRequest | null> {
    return (await UserLoginRequest.query().findOne({ accessToken })) ?? null;
  }

  static async init(email: string): Promise<string> {
    await this.deleteExpired();
    let request = await UserLoginRequest.findByEmail(email);
    if (request == null) {
      request = await UserLoginRequest.query().insertAndFetch({
        email,
        accessToken: Random.string(20),
      });
    }
    return request.accessToken!;
  }

  static async login(accessToken: string): Promise<User | null> {
    await this.deleteExpired();
    const request = await UserLoginRequest.findByAccessToken(accessToken);
    if (request != null) {
      return User.login(request.email!);
    }
    return null;
  }

  static async deleteExpired(now: number = Date.now()): Promise<void> {
    await UserLoginRequest.query()
      .where("createdAt", "<", new Date(now - UserLoginRequest.expireTime))
      .delete();
  }
}

User.relationMappings = {
  externalIds: {
    relation: Model.HasManyRelation,
    modelClass: UserExternalId,
    join: {
      from: "user.id",
      to: "user_external_id.user_id",
    },
  },
  order: {
    relation: Model.HasOneRelation,
    modelClass: Order,
    join: {
      from: "user.id",
      to: "order.user_id",
    },
  },
};

UserExternalId.relationMappings = {
  user: {
    relation: Model.BelongsToOneRelation,
    modelClass: User,
    join: {
      from: "user_external_id.user_id",
      to: "user.id",
    },
  },
};

Order.relationMappings = {
  user: {
    relation: Model.BelongsToOneRelation,
    modelClass: User,
    join: {
      from: "order.user_id",
      to: "user.id",
    },
  },
};

UserLoginRequest.relationMappings = {};
