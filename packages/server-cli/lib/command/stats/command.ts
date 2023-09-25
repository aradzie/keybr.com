import { injectable } from "@fastr/invert";
import { PublicId } from "@keybr/publicid";
import { UserDataFactory } from "@keybr/result-userdata";
import { Argument, Command, Option } from "commander";
import { parseTimestamp, parseUserIdRange } from "./argument.ts";
import { checkFile } from "./check-file.ts";
import { fixFile } from "./fix-file.ts";
import { fstat } from "./fstat.ts";
import { type UserIdRange } from "./userid-range.ts";

@injectable()
export class StatsCommand {
  constructor(private readonly userDataFactory: UserDataFactory) {}

  command(): Command {
    return new Command("check-stats")
      .description("Check and recover user stats.")
      .addOption(new Option("--fix", "Fix damaged user stats."))
      .addOption(
        new Option(
          "--since <timestamp>",
          "Check only files modified since the given timestamp.",
        ).argParser(parseTimestamp),
      )
      .addOption(new Option("--silent", "Hide the details."))
      .addArgument(
        new Argument(
          "<user-id-range>",
          "Range of the user ids to check.",
        ).argParser(parseUserIdRange),
      )
      .action(this.action.bind(this));
  }

  async action(
    range: UserIdRange,
    {
      fix = false,
      since = new Date(0),
      silent = false,
    }: {
      readonly fix?: boolean;
      readonly since?: Date;
      readonly silent?: boolean;
    },
  ): Promise<void> {
    if (since.getTime() > 0) {
      if (!silent) {
        console.log(`Checking stats modified since ${since.toISOString()}.`);
      }
    }

    for (const userId of range) {
      const file = this.userDataFactory.getFile(new PublicId(userId));
      const stat = await fstat(file);

      if (stat == null || !stat.isFile()) {
        if (!silent) {
          console.log(`No stats of user=[${userId}], file=[${file.name}].`);
        }
        continue;
      }

      if (since.getTime() > 0 && stat.mtime.getTime() < since.getTime()) {
        if (!silent) {
          console.log(
            `Skipping stats of user=[${userId}], file=[${file.name}].`,
          );
        }
        continue;
      }

      if (!silent) {
        console.log(`Checking stats of user=[${userId}], file=[${file.name}].`);
      }

      const status = checkFile(await file.read());
      switch (status.type) {
        case "good_file": {
          const { results } = status;
          if (!silent) {
            console.log(`File is good. Read [${results.length}] results.`);
          }
          break;
        }
        case "bad_file": {
          const { results, fileSize, readSize } = status;
          if (!silent) {
            console.warn(
              `File is corrupted! ` +
                `Recovered [${results.length}] results, ` +
                `${readSize} of ${fileSize} bytes.`,
            );
          }
          if (fix) {
            await fixFile(file, results);
            if (!silent) {
              console.log(`File was recovered.`);
            }
          }
          break;
        }
      }
    }
  }
}
