import { injectable } from "@fastr/invert";
import { User } from "@keybr/database";
import { Argument, Command, InvalidArgumentError, Option } from "commander";
import { userToInfo } from "./info.ts";

@injectable()
export class UserInfoCommand {
  command(): Command {
    return new Command("user-info")
      .description("Display user info.")
      .addArgument(new Argument("<user-id-or-email>", "User id or email."))
      .addOption(
        new Option(
          "--set-email <email>",
          "Set a new e-mail address for a user.",
        ),
      )
      .action(this.action.bind(this));
  }

  async action(
    idOrEmail: string,
    { setEmail = null }: { readonly setEmail?: string | null },
  ): Promise<void> {
    let user = await findUser(idOrEmail);
    if (user == null) {
      throw new InvalidArgumentError(`User [${idOrEmail}] not found.`);
    }
    if (setEmail) {
      const { email } = user;
      await user.$query().patch({ email: setEmail }).findById(user.id!);
      user = await User.findById(user.id!);
      if (user == null) {
        throw new Error();
      }
      console.log(`User email changed from [${email}] to [${user.email}].`);
    }
    console.log(userToInfo(user));
  }
}

async function findUser(idOrEmail: string): Promise<User | null> {
  if (/^[0-9]+$/.test(idOrEmail)) {
    return await User.findById(Number.parseInt(idOrEmail, 10));
  }
  if (/^.+@.+$/.test(idOrEmail)) {
    return await User.findByEmail(idOrEmail);
  }
  throw new InvalidArgumentError(`Invalid user id or email [${idOrEmail}].`);
}
