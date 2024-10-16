import { CustomTheme, type PropName, type PropValue } from "@keybr/themes";

export class ImportState {
  #theme = new CustomTheme();
  readonly #errors: Array<Error> = [];

  get theme() {
    return this.#theme;
  }

  get errors() {
    return this.#errors;
  }

  set(prop: PropName, value: PropValue): this {
    this.#theme = this.#theme.set(prop, value);
    return this;
  }

  error(error: Error): this {
    this.#errors.push(error);
    return this;
  }
}
