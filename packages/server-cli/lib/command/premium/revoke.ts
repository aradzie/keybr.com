import { injectable } from "@fastr/invert";
import { User } from "@keybr/database";
import { Argument, Command, InvalidArgumentError } from "commander";

@injectable()
export class RevokeCommand {
  command(): Command {
    return new Command("revoke")
      .description("Revoke premium account from a user.")
      .addArgument(new Argument("<user-email>", "User email."))
      .action(this.action.bind(this));
  }

  async action(email: string): Promise<void> {
    const user = await User.findByEmail(email);
    if (user == null) {
      throw new InvalidArgumentError(`User [${email}] not found.`);
    }
    if (user.order == null) {
      throw new InvalidArgumentError(`User [${email}] is not premium.`);
    }
    console.log(`Revoke premium account from user [${email}].`);
    await user.$relatedQuery("order").delete();
  }
}
