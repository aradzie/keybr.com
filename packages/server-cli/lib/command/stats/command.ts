import { injectable } from "@fastr/invert";
import { PublicId } from "@keybr/publicid";
import { Result } from "@keybr/result";
import { UserDataFactory } from "@keybr/result-userdata";
import { Argument, Command, Option } from "commander";
import { parseSpeed, parseTimestamp, parseUserIdRange } from "./argument.ts";
import { checkFile } from "./check-file.ts";
import { fixFile } from "./fix-file.ts";
import { fstat } from "./fstat.ts";
import { type UserIdRange } from "./userid-range.ts";

@injectable()
export class StatsCommand {
  constructor(readonly userDataFactory: UserDataFactory) {}

  command() {
    return new Command("check-stats")
      .description("Check and fix user stats.")
      .addOption(
        new Option(
          "--min-speed <speed>",
          "Minimal allowed result speed, inclusive.",
        ).argParser(parseSpeed),
      )
      .addOption(
        new Option(
          "--max-speed <speed>",
          "Maximal allowed result speed, inclusive.",
        ).argParser(parseSpeed),
      )
      .addOption(
        new Option(
          "--since <timestamp>",
          "Check only files modified since the given timestamp.",
        ).argParser(parseTimestamp),
      )
      .addOption(new Option("--fix", "Fix damaged user stats."))
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
      minSpeed = Result.filter.minSpeed,
      maxSpeed = Result.filter.maxSpeed,
      since = new Date(0),
      fix = false,
      verbose = false,
    }: {
      readonly minSpeed?: number;
      readonly maxSpeed?: number;
      readonly since?: Date;
      readonly fix?: boolean;
      readonly verbose?: boolean;
    },
  ) {
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

      const status = checkFile(await file.read(), { minSpeed, maxSpeed });
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
