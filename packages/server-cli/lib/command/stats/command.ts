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
  constructor(readonly userDataFactory: UserDataFactory) {}

  command(): Command {
    return new Command("check-stats")
      .description("Check and fix user stats.")
      .addOption(new Option("--fix", "Fix damaged user stats."))
      .addOption(
        new Option(
          "--since <timestamp>",
          "Check only files modified since the given timestamp.",
        ).argParser(parseTimestamp),
      )
      .addOption(new Option("--verbose", "Show more diagnostic messages."))
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
      verbose = false,
    }: {
      readonly fix?: boolean;
      readonly since?: Date;
      readonly verbose?: boolean;
    },
  ): Promise<void> {
    if (since.getTime() > 0) {
      if (verbose) {
        console.log(`Checking stats modified since ${since.toISOString()}.`);
      }
    }

    for (const userId of range) {
      const file = this.userDataFactory.getFile(new PublicId(userId));
      const stat = await fstat(file);

      if (stat == null || !stat.isFile()) {
        if (verbose) {
          console.log(`No stats of user=[${userId}], file=[${file.name}].`);
        }
        continue;
      }

      if (since.getTime() > 0 && stat.mtime.getTime() < since.getTime()) {
        if (verbose) {
          console.log(
            `Skipping stats of user=[${userId}], file=[${file.name}].`,
          );
        }
        continue;
      }

      const status = checkFile(await file.read());
      switch (status.type) {
        case "good": {
          const { results } = status;
          if (verbose) {
            console.log(
              `Good data, user=[${userId}], file=[${file.name}]. ` +
                `Read ${results.length} results.`,
            );
          }
          break;
        }
        case "bad": {
          const { results, invalid } = status;
          console.warn(
            `Bad data, user=[${userId}], file=[${file.name}]. ` +
              `Read ${results.length} results. ` +
              `Ignored ${invalid.length} invalid results.`,
          );
          if (fix) {
            await fixFile(file, results);
            if (verbose) {
              console.log(`File was fixed.`);
            }
          }
          break;
        }
      }
    }
  }
}
