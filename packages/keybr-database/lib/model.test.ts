import { makeKnex } from "@keybr/config";
import { PublicId } from "@keybr/publicid";
import { fake } from "@keybr/test-env-time";
import test from "ava";
import { ValidationError } from "objection";
import { User, UserExternalId, UserLoginRequest } from "./model.ts";
import { createSchema } from "./schema.ts";
import { clearTables, seedModels } from "./testing/seeds.ts";
import { Random } from "./util.ts";

const now = new Date("2001-02-03T04:05:06Z");

test.beforeEach(async () => {
  await createSchema(makeKnex());
  await clearTables();
  await seedModels();
});

test.beforeEach(() => {
  fake.date.set(now);
});

test.afterEach(() => {
  fake.date.reset();
});

test("validate models", (t) => {
  t.deepEqual(
    Object.keys(
      t.throws(
        () => {
          User.fromJson({});
        },
        { instanceOf: ValidationError },
      )!.data,
    ),
    ["email", "name"],
  );
  t.throws(
    () => {
      User.fromJson({
        name: null,
        email: null,
      });
    },
    { instanceOf: ValidationError },
  );
  t.throws(
    () => {
      User.fromJson({
        name: "",
        email: "",
      });
    },
    { instanceOf: ValidationError },
  );
  t.notThrows(() => {
    User.fromJson({
      name: "name",
      email: "email",
    });
  });

  t.deepEqual(
    Object.keys(
      t.throws(
        () => {
          UserExternalId.fromJson({});
        },
        { instanceOf: ValidationError },
      )!.data,
    ),
    ["provider", "externalId"],
  );
  t.throws(
    () => {
      UserExternalId.fromJson({
        provider: null,
        externalId: null,
      });
    },
    { instanceOf: ValidationError },
  );
  t.throws(
    () => {
      UserExternalId.fromJson({
        provider: "",
        externalId: "",
      });
    },
    { instanceOf: ValidationError },
  );
  t.notThrows(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
    });
  });
  t.notThrows(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
      name: null,
      url: null,
      imageUrl: null,
    });
  });
  t.notThrows(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
      name: "name",
      url: "url",
      imageUrl: "imageUrl",
    });
  });
});

test("automatically populate createdAt", async (t) => {
  const user = await User.query().insertGraph({
    email: "user0@keybr.com",
    name: "user0",
    externalIds: [
      {
        provider: "provider0",
        externalId: "externalId0",
        name: "externalName0",
        url: "url0",
        imageUrl: "imageUrl0",
      },
    ],
  });

  t.deepEqual(user.createdAt, now);
  t.deepEqual(user.externalIds![0].createdAt, now);
});

test("generate unique user name", async (t) => {
  await User.query().insertGraph({
    email: `test@keybr.com`,
    name: `test`,
    createdAt: now,
  });
  for (let i = 1; i <= 9; i++) {
    await User.query().insertGraph({
      email: `test${i}@keybr.com`,
      name: `test${i}`,
      createdAt: now,
    });
  }
  await User.query().insertGraph({
    email: `example@keybr.com`,
    name: `example`,
    createdAt: now,
  });

  t.is(await User.findUniqueName(null, "x".repeat(100)), "x".repeat(32));
  t.is(
    await User.findUniqueName(null, "x".repeat(100) + "@keybr.com"),
    "x".repeat(32),
  );
  t.is(await User.findUniqueName(null, "unique"), "unique");
  t.is(await User.findUniqueName(null, "unique@keybr.com"), "unique");
  t.is(await User.findUniqueName(null, "test"), "test10");
  t.is(await User.findUniqueName(null, "test@keybr.com"), "test10");
  t.is(await User.findUniqueName("test@keybr.com", "test"), "test");
  t.is(await User.findUniqueName("test@keybr.com", "test@keybr.com"), "test");
  t.is(await User.findUniqueName(null, "test10"), "test10");
  t.is(await User.findUniqueName(null, "test10@keybr.com"), "test10");
  t.is(await User.findUniqueName("test@keybr.com", "example"), "example1");
  t.is(
    await User.findUniqueName("test@keybr.com", "example@keybr.com"),
    "example1",
  );
});

test("create user from resource owner with null values", async (t) => {
  const email = "example1@keybr.com";

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "example1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
    },
  );
});

test("create user from resource owner with non-null values", async (t) => {
  const email = "example1@keybr.com";

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
    },
  );
});

test("create user from resource owner with invalid values", async (t) => {
  const email = "example1@keybr.com";

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: "x".repeat(1000),
        imageUrl: "x".repeat(1000),
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "example1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
    },
  );
});

test("update user from resource owner with null values", async (t) => {
  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
      order: null,
    },
  );
});

test("update user from resource owner with non-null values", async (t) => {
  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    },
  );

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1!",
        url: "url1!",
        imageUrl: "imageUrl1!",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1!",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1!",
          url: "url1!",
          imageUrl: "imageUrl1!",
        },
      ],
      order: null,
    },
  );
});

test("update user from resource owner with invalid values", async (t) => {
  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    },
  );

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1!",
        url: "x".repeat(1000),
        imageUrl: "x".repeat(1000),
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1!",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1!",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    },
  );
});

test("merge multiple resource owners", async (t) => {
  const email = "example1@keybr.com";

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      // order: null,
    },
  );

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider2",
        id: "id2",
        email: email,
        name: "name2",
        url: "url2",
        imageUrl: "imageUrl2",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name2",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
        {
          id: 5,
          userId: 4,
          createdAt: now,
          provider: "provider2",
          externalId: "id2",
          name: "name2",
          url: "url2",
          imageUrl: "imageUrl2",
        },
      ],
      order: null,
    },
  );
});

// eslint-disable-next-line ava/no-skip-test
test.skip("handle email change", async (t) => {
  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: "example1@keybr.com",
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: "example1@keybr.com",
      name: "name1",
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    },
  );

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: "changed@keybr.com",
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: "changed@keybr.com",
      name: "name1",
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    },
  );
});

test("generates unique name for resource owner", async (t) => {
  await User.query().insertGraph({
    email: "example1@keybr.com",
    name: "name",
    createdAt: now,
  });

  t.deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider2",
        id: "id2",
        email: "example2@keybr.com",
        name: "name",
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 5,
      createdAt: now,
      email: "example2@keybr.com",
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 5,
          createdAt: now,
          provider: "provider2",
          externalId: "id2",
          name: "name",
          url: null,
          imageUrl: null,
        },
      ],
      // order: null,
    },
  );
});

test("make premium user", async (t) => {
  const user = await User.query().insertGraph({
    email: "user0@keybr.com",
    name: "user0",
    externalIds: [],
  });

  t.like(User.toPublicUser(await User.findById(user.id!), ""), {
    premium: false,
  });

  await user.$relatedQuery("order").insert({
    provider: "paddle",
    id: "order id",
    createdAt: now,
    name: null,
    email: null,
  });

  t.like(User.toPublicUser(await User.findById(user.id!), ""), {
    premium: true,
  });
});

test("create access token", async (t) => {
  // Should create a new access token.

  Random.string = () => "token1";
  t.is(await UserLoginRequest.init("example1@keybr.com"), "token1");
  t.is(await User.findByEmail("example1@keybr.com"), null);
  t.deepEqual(
    (await UserLoginRequest.findByEmail("example1@keybr.com"))!.toJSON(),
    {
      id: 1,
      email: "example1@keybr.com",
      accessToken: "token1",
      createdAt: now,
    },
  );

  // Should reuse an existing access token.

  Random.string = () => "tokenX";
  t.is(await UserLoginRequest.init("example1@keybr.com"), "token1");
  t.is(await User.findByEmail("example1@keybr.com"), null);
  t.deepEqual(
    (await UserLoginRequest.findByEmail("example1@keybr.com"))!.toJSON(),
    {
      id: 1,
      email: "example1@keybr.com",
      accessToken: "token1",
      createdAt: now,
    },
  );
});

test("delete expired access token", async (t) => {
  Random.string = () => "token1";
  t.is(await UserLoginRequest.init("example1@keybr.com"), "token1");

  t.not(await UserLoginRequest.findByEmail("example1@keybr.com"), null);
  t.not(await UserLoginRequest.findByAccessToken("token1"), null);

  await UserLoginRequest.deleteExpired(
    now.getTime() + UserLoginRequest.expireTime + 1000,
  );

  t.is(await UserLoginRequest.findByEmail("example1@keybr.com"), null);
  t.is(await UserLoginRequest.findByAccessToken("token1"), null);
});

test("login with a valid access token", async (t) => {
  Random.string = () => "token1";

  // Should create a new access token.

  t.is(await UserLoginRequest.init("example1@keybr.com"), "token1");

  // Before first login.

  t.is(await User.findByEmail("example1@keybr.com"), null);
  t.not(await UserLoginRequest.findByEmail("example1@keybr.com"), null);

  // First login.

  t.deepEqual((await UserLoginRequest.login("token1"))!.toJSON(), {
    id: 4,
    createdAt: now,
    email: "example1@keybr.com",
    name: "example1",
    anonymized: 0,
    externalIds: [],
    order: null,
  });

  // Should create a new user after login.

  t.not(await User.findByEmail("example1@keybr.com"), null);
  t.not(await UserLoginRequest.findByEmail("example1@keybr.com"), null);

  // Second login.

  t.deepEqual((await UserLoginRequest.login("token1"))!.toJSON(), {
    id: 4,
    createdAt: now,
    email: "example1@keybr.com",
    name: "example1",
    anonymized: 0,
    externalIds: [],
    order: null,
  });

  // Should load an existing user after login.

  t.not(await User.findByEmail("example1@keybr.com"), null);
  t.not(await UserLoginRequest.findByEmail("example1@keybr.com"), null);
});

test("ignore invalid access token", async (t) => {
  Random.string = () => "token1";

  t.is(await UserLoginRequest.login("token1"), null);
  t.is(await UserLoginRequest.login("abc"), null);
  t.is(await UserLoginRequest.login("xyz"), null);
});

test("access token should be case-sensitive", async (t) => {
  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "token",
    createdAt: now,
  });

  t.not(await UserLoginRequest.findByAccessToken("token"), null);
  t.is(await UserLoginRequest.findByAccessToken("TOKEN"), null);
});

test("load profile owner", async (t) => {
  t.is(await User.loadProfileOwner(new PublicId(999)), null);
  t.deepEqual(await User.loadProfileOwner(PublicId.of("example1")), {
    id: "example1",
    name: "Example User 1",
    imageUrl: null,
    premium: false,
  });
  t.deepEqual(await User.loadProfileOwner(new PublicId(1)), {
    id: "55vdtk1",
    name: "externalName1",
    imageUrl: "imageUrl1",
    premium: false,
  });
});

test("convert to user details", async (t) => {
  t.deepEqual((await User.findByEmail("user1@keybr.com"))?.toDetails(), {
    id: "55vdtk1",
    email: "user1@keybr.com",
    name: "user1",
    anonymized: false,
    externalId: [
      {
        provider: "provider1",
        id: "externalId1",
        name: "externalName1",
        url: "url1",
        imageUrl: "imageUrl1",
        createdAt: new Date("2001-02-03T04:05:06Z"),
      },
    ],
    order: null,
    createdAt: now,
  });
});

test("make public user for anonymous", (t) => {
  t.deepEqual(User.toPublicUser(null, "hint1"), {
    id: null,
    name: "Suspicious Silverfish",
    imageUrl: null,
  });
  t.deepEqual(User.toPublicUser(null, "hint2"), {
    id: null,
    name: "Suspicious Skink",
    imageUrl: null,
  });
});

test("make public user from user name", (t) => {
  t.deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "somebody",
      imageUrl: null,
      premium: false,
    },
  );
});

test("make public user from external user id", (t) => {
  t.deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [
          {
            id: 1,
            provider: "provider",
            externalId: "externalId",
            name: null,
            url: null,
            imageUrl: null,
            createdAt: new Date(0),
          },
        ],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "somebody",
      imageUrl: null,
      premium: false,
    },
  );
  t.deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [
          {
            id: 1,
            provider: "provider",
            externalId: "externalId",
            name: "xyz",
            url: "url",
            imageUrl: "imageUrl",
            createdAt: new Date(0),
          },
        ],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "xyz",
      imageUrl: "imageUrl",
      premium: false,
    },
  );
});

test("make public user with anonymous name", (t) => {
  t.deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email1",
        name: "somebody",
        anonymized: 1,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "Distinctive Vulture",
      imageUrl: null,
      premium: false,
    },
  );
  t.deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email2",
        name: "somebody",
        anonymized: 1,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "Distinctive Wallaby",
      imageUrl: null,
      premium: false,
    },
  );
});

test("parse resource owner", (t) => {
  t.deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "email1",
      name: "name1",
      url: "url1",
      imageUrl: "imageUrl",
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "email1",
      name: "name1",
      url: "url1",
      imageUrl: "imageUrl",
    },
  );
  t.deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: null,
      url: null,
      imageUrl: null,
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: null,
      url: null,
      imageUrl: null,
    },
  );
  t.deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "x".repeat(67),
      name: "x".repeat(33),
      url: "x".repeat(257),
      imageUrl: "x".repeat(257),
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: "x".repeat(32),
      url: null,
      imageUrl: null,
    },
  );
});
