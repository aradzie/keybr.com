import { readFileSync, writeFileSync } from "node:fs";

process("be");
process("cs");
process("en");
process("es");
process("fr");
process("pl");
process("sv");
process("uk");

function process(id) {
  const original = readFileSync(`corpus-${id}-raw.txt`, "utf-8").normalize("NFC");
  const formatted = reformat(original);
  writeFileSync(`corpus-${id}.txt`, formatted);
}

function reformat(text) {
  const body = [];
  const para = [];

  const pushPara = () => {
    if (para.length > 0) {
      const line = [];
      let width = 0;
      const pushLine = () => {
        if (line.length > 0) {
          body.push(line.join(" "));
          line.length = 0;
          width = 0;
        }
      };
      for (const word of para) {
        if (width + word.length > 80) {
          pushLine();
        }
        line.push(word);
        width += word.length + 1;
      }
      pushLine();
      para.length = 0;
    }
  };

  for (let line of text.split("\n")) {
    line = line.trim();
    if (line.length >= 10) {
      const words = findWords(line);
      for (const word of words) {
        // Remove words containing uppercase letters to exclude names.
        // Does not work for the German language!
        if (!/\p{Lu}/u.test(word)) {
          para.push(word);
        }
      }
    }
    else {
      pushPara();
    }
  }
  pushPara();

  return body.join("\n");
}

function findWords(text) {
  const words = [];
  const regexp = /(\p{L}|'|-)+/gu;
  while (true) {
    const match = regexp.exec(text);
    if (match == null) {
      break;
    }
    const word = match[0];
    if (!word.includes("'") && !word.includes("-")) {
      words.push(word);
    }
  }
  return words;
}
