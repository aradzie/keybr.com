import { Model } from "objection";
import { Order, User, UserExternalId, UserLoginRequest } from "../model.ts";

export async function seedModels(): Promise<void> {
  await User.query().delete();
  await User.query().insertGraph([
    {
      email: "user1@keybr.com",
      name: "user1",
      createdAt: new Date("2001-02-03T04:05:06Z"),
      externalIds: [
        {
          provider: "provider1",
          externalId: "externalId1",
          name: "externalName1",
          url: "url1",
          imageUrl: "imageUrl1",
          createdAt: new Date("2001-02-03T04:05:06Z"),
        } as UserExternalId,
      ],
    } as User,
    {
      email: "user2@keybr.com",
      name: "user2",
      createdAt: new Date("2001-02-03T04:05:06Z"),
      externalIds: [
        {
          provider: "provider2",
          externalId: "externalId2",
          name: "externalName2",
          url: "url2",
          imageUrl: "imageUrl2",
          createdAt: new Date("2001-02-03T04:05:06Z"),
        } as UserExternalId,
      ],
    } as User,
    {
      email: "user3@keybr.com",
      name: "user3",
      createdAt: new Date("2001-02-03T04:05:06Z"),
      externalIds: [
        {
          provider: "provider3",
          externalId: "externalId3",
          name: "externalName3",
          url: "url3",
          imageUrl: "imageUrl3",
          createdAt: new Date("2001-02-03T04:05:06Z"),
        } as UserExternalId,
      ],
    } as User,
  ]);
}

export async function clearTables(): Promise<void> {
  await clearTable(UserLoginRequest.tableName);
  await clearTable(Order.tableName);
  await clearTable(UserExternalId.tableName);
  await clearTable(User.tableName);
}

export async function clearTable(name: string): Promise<void> {
  const knex = Model.knex();
  const tpl = (sql: string) => {
    return sql.replaceAll("{name}", name);
  };
  await knex.raw(tpl("DELETE FROM `{name}`"));
  switch (knex.client.config.__client) {
    case "mysql":
      await knex.raw(tpl("ALTER TABLE `{name}` AUTO_INCREMENT = 1"));
      break;
    case "sqlite":
      await knex.raw(
        tpl("UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = '{name}';"),
      );
      break;
  }
}
