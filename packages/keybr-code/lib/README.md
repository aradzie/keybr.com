# Adding a New Syntax

## Defining the Grammar
Create a file `syntax/lang_*.g` and define the grammar. See existing files for examples.

## Compiling
Run `./compile.ts` to generate the corresponding TS files.

Note: The output does not follow the linting rules, but this is not a problem since it will be automatically formatted on commit.

## Registering
Extend `syntax.ts` to include the new syntax.

## Sanity Check
Run `./example.ts` to sanity check the grammar.

