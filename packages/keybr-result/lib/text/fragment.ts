export class TextFragment {
  maxWords?: number;

  someMethod() {
    if (this.maxWords !== undefined) {
      // Use maxWords safely
      console.log(`Max words: ${this.maxWords}`);
    } else {
      // Handle the case when maxWords is undefined
      console.log("Max words is undefined");
    }
  }
}
