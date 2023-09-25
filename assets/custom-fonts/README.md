# Font Files

The `*.ttf` files are the original files.

The `*.sdf` files are modified from `*.ttf` to remove unused characters
and add missing characters.

To optimize font loading in the browser split a single font file containing
the whole character set into multiple files based on Unicode character ranges
using the [ttf2web](https://github.com/johncf/ttf2web) tool.

The `unicode-ranges` file is a set of pre-defined Unicode ranges.

```
$ ttf2web -v --unicode-ranges unicode-ranges ubuntu-mono-400.ttf
$ ttf2web -v --unicode-ranges unicode-ranges ubuntu-mono-400italic.ttf
$ ttf2web -v --unicode-ranges unicode-ranges ubuntu-mono-700.ttf
$ ttf2web -v --unicode-ranges unicode-ranges ubuntu-mono-700italic.ttf
```
