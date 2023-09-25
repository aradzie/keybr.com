import { injectable } from "@fastr/invert";
import { User } from "@keybr/database";
import { Argument, Command, InvalidArgumentError } from "commander";

@injectable()
export class GrantCommand {
  command(): Command {
    return new Command("grant")
      .description("Grant premium account to a user.")
      .addArgument(new Argument("<user-email>", "User email."))
      .action(this.action.bind(this));
  }

  async action(email: string): Promise<void> {
    const user = await User.findByEmail(email);
    if (user == null) {
      throw new InvalidArgumentError(`User [${email}] not found.`);
    }
    if (user.order != null) {
      throw new InvalidArgumentError(`User [${email}] is already premium.`);
    }
    console.log(`Grant premium account to user [${email}].`);
    await user.$relatedQuery("order").insert({
      provider: "manual",
      id: email,
      createdAt: new Date(),
      name: user.name || null,
      email: user.email || null,
    });
  }
}
