#!/bin/env python3

from fontTools.ttLib import TTFont
from fontTools.subset import parse_unicodes, Subsetter
from fontTools.merge import Merger


unicode_ranges = [
    ("cyrillic", "U+0400-04FF"),
    ("greek", "U+0370-03FF"),
    ("hebrew", "U+0590-05FF"),
    ("latin", "U+0000-00FF, U+2000-206F, U+2200-22FF, U+E000-E003"),
    ("latin-ext", "U+0100-017F, U+0180-024F, U+0300-036F, U+20A0-20CF"),
]


class Font:
    def __init__(self, font_file, font_name, merge_file=None):
        self.font_file = font_file
        self.merge_file = merge_file

        font = TTFont(font_file, lazy=True)
        font_family = font["name"].getDebugName(1)
        font_subfamily = font["name"].getDebugName(2)
        font.close()

        self.font_family = font_family
        self.font_subfamily = font_subfamily
        self.font_weight = (
            "700"
            if font_subfamily == "Bold" or font_subfamily == "Bold Italic"
            else "400"
        )
        self.font_style = (
            "italic"
            if font_subfamily == "Italic" or font_subfamily == "Bold Italic"
            else "normal"
        )
        self.font_name = (
            f"{font_name}-{self.font_weight}italic"
            if self.font_style == "italic"
            else f"{font_name}-{self.font_weight}"
        )

    def generate(self):
        font_list = []
        for range_name, subrange in unicode_ranges:
            unicodes = parse_unicodes(subrange)
            if self.merge_file:
                font = Merger().merge([self.font_file, self.merge_file])
            else:
                font = TTFont(self.font_file)
            subs = Subsetter()
            subs.populate(unicodes=unicodes)
            subs.subset(font)
            cmap = font.getBestCmap()
            if cmap:
                font_url = f"{self.font_name}.{range_name}.woff2"
                font.flavor = "woff2"
                font.save(f"assets/{font_url}")
                font_list.append((font_url, subrange))
                print(
                    f"[{self.font_name}.{range_name}]: "
                    + f"Found {len(font.getGlyphOrder()) - 1} glyphs "
                    + f"for {len(cmap)} out of {len(unicodes)} unicodes"
                )
            else:
                print(
                    f"[{self.font_name}.{range_name}]: "
                    + f"Found no glyphs for any of {len(unicodes)} unicodes"
                )
            font.close()
        css = []
        for font_url, subrange in font_list:
            item = f"""@font-face {{
  font-family: "{self.font_family}";
  font-weight: {self.font_weight};
  font-style: {self.font_style};
  font-display: swap;
  src: url(../assets/{font_url}) format("woff2");
  unicode-range: {subrange};
}}"""
            css.append(item)
        css.append("")
        with open(f"lib/{self.font_name}.css", "w") as file:
            print("\n".join(css), end="", file=file)


def generate(font_file, font_name, merge_file=None):
    Font(font_file, font_name, merge_file).generate()


def main():
    generate(
        "fonts/OpenSans/static/OpenSans-Regular.ttf",
        "opensans",
    )
    generate(
        "fonts/OpenSans/static/OpenSans-Italic.ttf",
        "opensans",
    )
    generate(
        "fonts/OpenSans/static/OpenSans-Bold.ttf",
        "opensans",
    )
    generate(
        "fonts/OpenSans/static/OpenSans-BoldItalic.ttf",
        "opensans",
    )
    generate(
        "fonts/Ubuntu/UbuntuMono-R.ttf",
        "ubuntu-mono",
        merge_file="Whitespace.ttf",
    )
    generate(
        "fonts/Ubuntu/UbuntuMono-RI.ttf",
        "ubuntu-mono",
        merge_file="Whitespace.ttf",
    )
    generate(
        "fonts/Ubuntu/UbuntuMono-B.ttf",
        "ubuntu-mono",
        merge_file="Whitespace.ttf",
    )
    generate(
        "fonts/Ubuntu/UbuntuMono-BI.ttf",
        "ubuntu-mono",
        merge_file="Whitespace.ttf",
    )


if __name__ == "__main__":
    main()
