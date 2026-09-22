declare module "knex/lib/dialects/mysql/index.js" {
  import { type Knex } from "knex";

  export default class Client extends Knex.Client {}
}

declare module "knex/lib/dialects/sqlite3/index.js" {
  import { type Knex } from "knex";

  export default class Client extends Knex.Client {}
}
