# Adding a new keyboard layout

*keybr.com* has a lot of different keyboard layouts for different languages. But your layout might not be available.
This guide will explain how to create a new layout before adding it to the application. Additional it will explain how a new layout family can be added.

## Creating a new layout

Custom keyboard layouts are located in `packages/keybr-keyboard-generator/lib/layout`.

You can add your own layouts by copying and modifying the existing layouts. The configuration format is simple, each physical key location (like KeyA, KeyB, etc) is mapped to either a multi-character string, an array of single-character strings, or an array of numeric code points.

```typescript
export const LAYOUT_XYZ: LayoutConfig = {
  codePoints: {
    ...
    KeyQ: "qQ",
    KeyW: ["c", "C"],
    KeyE: [0x006f, 0x004f],
    ...
```

You then have to edit the `index.ts` file and import your layout. Furthermore, your layout has to be added to the `files` array. It could look similar to this:

```typescript
import { LAYOUT_EN_CUSTOM } from "./layout/layout_en_custom.ts";

const files: readonly [input: string | LayoutConfig, output: string][] = [
    ...
    [LAYOUT_EN_CUSTOM, "../keybr-keyboard/lib/data/layout/en_custom.ts"],
];

```

To start the generator run the following shell commands:

```bash
cd packages/keybr-keyboard-generator/
npm run generate
```

## Adding a new layout

Your new layout will now be generated and stored in `packages/keybr-keyboard/lib/data/layout/`. Do not edit any file in this directory, due to all of them being generated.

But you have to edit the file `layout.ts` in `packages/keybr-keyboard/lib/data/` and export your generated layout. For example:

```typescript
export { LAYOUT_EN_US_DVORAK_WIN } from "./layout/en_us_dvorak-win.ts";
```
Next you have to edit the file `load.ts` in `packages/keybr-keyboard/lib/`, import the exported layout and add it to `layoutDict`. The key `Layout.<LayoutName>` will be defined in a different file. `load.ts` could look similiar to this:

```typescript
import {
    ...
    LAYOUT_IT_IT_WIN,
} from "./data/layout.ts";

const layoutDict = new Map<Layout, CodePointDict>([
    ...
    [Layout.IT_IT, LAYOUT_IT_IT_WIN],
]);
```

Now we will add `<LayoutName>` to the `Layout` class in `packages/keybr-layout/lib/layout.ts`.

```typescript
static readonly FR_OPTIMOT_ERGO = new Layout(
    /* id= */ "fr-optimot-ergo",
    /* xid= */ 0x35,
    /* name= */ "Optimot Ergo",
    /* family= */ LayoutFamily.OPTIMOT_ERGO,
    /* language= */ Language.FR,
    /* emulate= */ false,
    /* geometries= */ new Enum(
      Geometry.STANDARD_102,
      Geometry.STANDARD_102_FULL,
      Geometry.STANDARD_101,
      Geometry.STANDARD_101_FULL,
      Geometry.MATRIX,
    ),
);
```

Select a unique `id` and `xid`. *Just increase the largest `xid` of a language by one.* Give the layout a name and select the language. Geometries allow the selection of *ISO*, *ANSI*, and a matrix layout. The family is something like *QWERTY*, *QWERTZ* or *AZERTY*.

## Adding a new layout family

To add a new layout family, you have to add it to the `LayoutFamily` class in `packages/keybr-layout/lib/layoutfamily.ts`. You first have to create a new family with an `id` and `script`. Furthermore you have to add it to the `ALL`enum.

```typescript
static readonly NEO = new LayoutFamily(
    /* id= */ "neo",
    /* script= */ "latin",
);

static readonly ALL = new Enum<LayoutFamily>(
    ...
    LayoutFamily.NEO,
);
```
