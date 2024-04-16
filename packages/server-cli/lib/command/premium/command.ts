import { injectable } from "@fastr/invert";
import { Command } from "commander";
import { GrantCommand } from "./grant.ts";
import { RevokeCommand } from "./revoke.ts";

@injectable()
export class PremiumCommand {
  constructor(
    readonly grant: GrantCommand,
    readonly revoke: RevokeCommand,
  ) {}

  command(): Command {
    return new Command("premium")
      .description("Manipulate premium accounts.")
      .addCommand(this.grant.command())
      .addCommand(this.revoke.command());
  }
}
