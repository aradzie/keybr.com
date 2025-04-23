# Languages and Lessons Guide

This document explains how to add new languages to KeyBr.com, both natural languages for typing practice and programming languages for code typing practice.

## Adding Natural Languages

KeyBr.com supports multiple natural languages for typing practice. Adding a new language involves defining the language properties and creating a phonetic model.

### Language Definition

1. Add a new language definition in `packages/keybr-keyboard/lib/language.ts` by adding a new instance to the `Language` class with the following properties:
   - `id`: Unique identifier for the language (usually the ISO 639-1 code)
   - `script`: The writing system (e.g., "latin", "cyrillic")
   - `direction`: Text direction ("ltr" for left-to-right or "rtl" for right-to-left)
   - `alphabet`: String containing all characters used in the language

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

2. Add your language definition to the `ALL` enum in the same file. Definitions are usually sorted alphabetically by ID.

### Creating a Phonetic Model

The phonetic model is used to generate realistic text for typing practice based on the frequency of characters and character combinations in the language.

1. Prepare a dictionary file:
   - Create a file at `packages/keybr-generators/dictionaries/dictionary-<language-id>.csv.gz`
   - The file should be in CSV format with two columns: word and frequency, separated by a comma
   - Compress the file using gzip to save space

2. Generate the phonetic model and word list:
   ```shell
   npm --workspace packages/keybr-generators run generate-languages
   ```

   The output should include information about your language:
   ```text
   [lt] 184657 unique words
   [lt] Generated model (184344 bytes)
   [lt] Generated word list (10000 words)
   ```

   Two files will be created:
   - `packages/keybr-phonetic-model/assets/model-<language-id>.data`: The phonetic model
   - `packages/keybr-content-words/lib/data/words-<language-id>.json`: Word list for the language

3. Commit these files along with your language definition to make the new language available.

## Adding Programming Languages

KeyBr.com also supports typing practice with programming language syntax. Adding a new programming language involves defining its grammar and registering it in the system.

### Step 1: Define the Grammar

1. Create a grammar file in `packages/keybr-code/lib/syntax/lang_<language_name>.g`

2. Define the grammar for your programming language. The grammar file defines the syntax rules for generating code snippets. Here's a simplified example of what it might look like:

   ```
   // Top-level entry point for the grammar
   start ->
     declaration
     | statement
     | expression
     ;
   
   // Language-specific rules
   declaration ->
     "function" _ identifier _ "(" [ parameter_list ] ")" _ "{" _ statement _ "}"
     ;
   
   // Use existing common components from other files when applicable
   identifier ->
     generic_variable_name
     | generic_function_name
     ;
   ```

   Examine existing grammar files in `packages/keybr-code/lib/syntax/` for guidance:
   - `lang_javascript.g`
   - `lang_python.g`
   - `lang_cpp.g`
   - etc.

3. The grammar can leverage common components defined in:
   - `_ident.g`: Common identifiers for variables, functions, and classes
   - `_keywords.g`: Common keywords used across programming languages

### Step 2: Generate the TypeScript File

1. Create a corresponding TypeScript file in the same directory:
   ```
   packages/keybr-code/lib/syntax/lang_<language_name>.ts
   ```

2. Run the compilation script to generate the grammar code:
   ```shell
   cd packages/keybr-code/lib
   ./compile.ts
   ```

   This will process your grammar file and update the TypeScript file with the parsed grammar definition.

### Step 3: Register the Grammar

1. Add your grammar to `packages/keybr-code/lib/syntax/grammars.ts`:
   ```typescript
   export { grammar as grammar_<language_name> } from "./lang_<language_name>.ts";
   ```

2. Import your grammar in `packages/keybr-code/lib/syntax.ts`:
   ```typescript
   import {
     // other imports
     grammar_<language_name>,
   } from "./syntax/grammars.ts";
   ```

3. Add a new syntax instance to the `Syntax` class:
   ```typescript
   static readonly <LANGUAGE_NAME> = new Syntax(
     "<language_id>",
     "<Language Display Name>",
     grammar_<language_name>
   );
   ```

4. Include your new syntax in the `ALL` enum:
   ```typescript
   static readonly ALL = new Enum<Syntax>(
     // other syntaxes
     Syntax.<LANGUAGE_NAME>,
   );
   ```

### Step 4: Test Your Grammar

1. Run the example script to generate sample code with your grammar:
   ```shell
   cd packages/keybr-code/lib
   ./example.ts
   ```

2. Verify that the generated code follows valid syntax for your programming language.

3. Make adjustments to your grammar as needed to ensure realistic and syntactically correct code generation.

## Tips for Creating Effective Grammars

1. **Start Small**: Begin with core syntax elements before adding complex constructs.

2. **Real-World Examples**: Base your grammar on real code examples to ensure the generated code is realistic.

3. **Reuse Common Components**: Leverage existing common identifiers and patterns from `_ident.g` and `_keywords.g`.

4. **Balance Complexity**: The grammar should generate code that is challenging but not overwhelming for typing practice.

5. **Test Thoroughly**: Generate many examples to ensure your grammar produces valid syntax in all cases.

## After Adding a New Language

1. Test the language by running the application locally.
2. Create a pull request with your changes.
3. Include examples of generated text or code in your pull request description.

## Additional Resources

- [KeyBr.com Architecture](ARCHITECTURE.mdx) - Overview of the project structure
- [Getting Started](getting_started.md) - Guide for setting up the development environment
- [Custom Keyboard](custom_keyboard.md) - Guide for adding custom keyboard layouts