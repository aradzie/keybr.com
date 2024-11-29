# Adding a new language

## Language definition

1. Add new language definition in `packages/keybr-keyboard/lib/language.ts` and
   define `id`, `script`, `direction` and `alphabet` properties.

    ```typescript
    export class Language implements EnumItem {
        static readonly LT = new Language(
        /* id= */ "lt",
        /* script= */ "latin",
        /* direction= */ "ltr",
        /* alphabet= */ "aąbcčdeęėfghiįyjklmnoprsštuųūvzž",
        );
    }
    ```

2. Add your language definition to `ALL` enum in
   `packages/keybr-keyboard/lib/language.ts`. Enum is sorted alphabetically.

## Phonetic model

1. Add dictionary of words in
   `packages/keybr-generators/dictionaries/dictionary-<language-id>.csv.gz`.
   File should be in CSV format, with two columns: word, and it's frequency
   separated by comma and gzipped for saving space, as it could be quite large.
2. TBD any info about dictionary file and it's content
3. Run command
   ```shell
   npm --workspace packages/keybr-generators run generate-languages
   ```
   from root project folder. You should see output with your language id:
   ```text
   [lt] 184657 unique words
   [lt] Generated model (184344 bytes)
   [lt] Generated word list (10000 words)
   ```
   Files `packages/keybr-phonetic-model/assets/model-<language-id>.data` and
   `packages/keybr-content-words/lib/data/words-<language-id>.json` should be
   created. These files should be commited along with new language definition.
