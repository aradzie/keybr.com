declare module "knex/lib/dialects/mysql" {
  import Knex from "knex";

  export default class Client extends Knex.Client {}
}

declare module "knex/lib/dialects/sqlite3" {
  import Knex from "knex";

  export default class Client extends Knex.Client {}
}

declare module "knex/lib/dialects/better-sqlite3" {
  import Knex from "knex";

  export default class Client extends Knex.Client {}
}
