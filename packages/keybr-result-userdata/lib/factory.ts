import { injectable } from "@fastr/invert";
import { DataDir } from "@keybr/config";
import { type PublicId } from "@keybr/publicid";
import { File } from "@sosimple/fsx-file";
import { UserData } from "./userdata.ts";

@injectable({ singleton: true })
export class UserDataFactory {
  constructor(readonly dataDir: DataDir) {}

  load(id: PublicId): UserData {
    return new UserData(id, this.getFile(id));
  }

  getFile(id: PublicId): File {
    if (id.example) {
      throw new TypeError();
    } else {
      return new File(this.dataDir.userStatsFile(id.id));
    }
  }
}
