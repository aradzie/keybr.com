import { CustomTextLesson } from "./customtext.ts";

export class Fragment {
  constructor(private customTextLesson: CustomTextLesson) {}

  get maxWords() {
    return this.customTextLesson.maxWords;
  }
}
