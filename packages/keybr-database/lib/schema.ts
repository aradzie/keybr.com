import { type Knex } from "knex";
import { Order, User, UserExternalId, UserLoginRequest } from "./model.ts";

export async function createSchema(knex: Knex): Promise<void> {
  const createTable = async ({
    tableName,
    createTable,
  }: {
    tableName: string;
    createTable: (knex: Knex, table: Knex.CreateTableBuilder) => void;
  }) => {
    const { schema } = knex;
    if (!(await schema.hasTable(tableName))) {
      await schema.createTable(tableName, (table) => {
        createTable(knex, table);
      });
    }
  };

  await createTable(User);
  await createTable(UserExternalId);
  await createTable(Order);
  await createTable(UserLoginRequest);
}
