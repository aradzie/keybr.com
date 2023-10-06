export type ExampleText = {
  readonly title: string;
  readonly content: string;
};

const jabberwocky: ExampleText = {
  title: "Jabberwocky",
  content:
    "Jabberwocky\n" +
    "\n" +
    "'Twas brillig, and the slithy toves\n" +
    "Did gyre and gimble in the wabe;\n" +
    "All mimsy were the borogoves,\n" +
    "And the mome raths outgrabe.\n" +
    "\n" +
    '"Beware the Jabberwock, my son!\n' +
    "The jaws that bite, the claws that catch!\n" +
    "Beware the Jubjub bird, and shun\n" +
    'The frumious Bandersnatch!"\n' +
    "\n" +
    "He took his vorpal sword in hand:\n" +
    "Long time the manxome foe he sought-\n" +
    "So rested he by the Tumtum tree,\n" +
    "And stood awhile in thought.\n" +
    "\n" +
    "And as in uffish thought he stood,\n" +
    "The Jabberwock, with eyes of flame,\n" +
    "Came whiffling through the tulgey wood,\n" +
    "And burbled as it came!\n" +
    "\n" +
    "One, two! One, two! and through and through\n" +
    "The vorpal blade went snicker-snack!\n" +
    "He left it dead, and with its head\n" +
    "He went galumphing back.\n" +
    "\n" +
    '"And hast thou slain the Jabberwock?\n' +
    "Come to my arms, my beamish boy!\n" +
    'O frabjous day! Callooh! Callay!"\n' +
    "He chortled in his joy.\n" +
    "\n" +
    "'Twas brillig, and the slithy toves\n" +
    "Did gyre and gimble in the wabe;\n" +
    "All mimsy were the borogoves,\n" +
    "And the mome raths outgrabe.",
};

const loremIpsum: ExampleText = {
  title: "Lorem Ipsum",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
    "Ut egestas libero non laoreet scelerisque. " +
    "Mauris nec sodales velit. " +
    "Quisque mattis eu nulla varius accumsan. " +
    "Sed interdum erat eu justo sodales, vel hendrerit diam pretium. " +
    "Phasellus lacus libero, scelerisque quis enim eget, tempus elementum massa. " +
    "Aenean elementum nec magna at fringilla. " +
    "Nam nisl eros, viverra et luctus eget, placerat non velit. " +
    "Cras ante velit, mattis quis porttitor nec, pellentesque eu sem. " +
    "Aenean blandit consectetur metus ut bibendum." +
    "Aliquam in suscipit erat. " +
    "Praesent non vulputate tortor, ac semper diam.",
};

const aShortStory: ExampleText = {
  title: "A Short Story",
  content:
    "Imagine all human beings swept off the face of the earth, excepting one man. " +
    "Imagine this man in some vast city, New York or London. " +
    "Imagine him on the third or fourth day of his solitude " +
    "sitting in a house and hearing a ring at the door-bell!",
};

export const exampleTexts: readonly ExampleText[] = [
  jabberwocky,
  loremIpsum,
  aShortStory,
];
