#!/bin/env python3

import os
from fontTools.ttLib import TTFont
from fontTools.subset import parse_unicodes, Subsetter

out_dir = "/home/caustic/Projects/keybr.com/packages/keybr-fonts/"


unicode_ranges = [
    ("cyrillic", "U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"),
    ("cyrillic-ext", "U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F"),
    ("greek", "U+0370-03FF"),
    ("greek-ext", "U+1F00-1FFF"),
    ("hebrew", "U+0590-05FF"),
    ("latin", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2212,U+2215"),
    ("latin-ext", "U+0100-024F,U+0259,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF"),
]


class Tool:
    def __init__(self, font_file, font_name, font_weight=None, font_style=None):
        self.font_file = font_file

        font = TTFont(font_file, lazy=True)
        font_family = font["name"].getDebugName(1)
        font_subfamily = font["name"].getDebugName(2)
        font.close()

        self.font_family = font_family
        self.font_subfamily = font_subfamily

        self.font_weight = font_weight
        if font_weight is None:
            self.font_weight = "700" if font_subfamily == "Bold" or font_subfamily == "Bold Italic" else "400"

        self.font_style = font_style
        if font_style is None:
            self.font_style = "italic" if font_subfamily == "Italic" or font_subfamily == "Bold Italic" else "normal"

        self.font_name = f"{font_name}-{self.font_weight}-{self.font_style}"

    def generate(self):
        font_list = []
        for range_name, subrange in unicode_ranges:
            unicodes = parse_unicodes(subrange)
            font = TTFont(self.font_file)
            subs = Subsetter()
            subs.populate(unicodes=unicodes)
            subs.subset(font)
            cmap = font.getBestCmap()
            if cmap:
                font_url = f"{self.font_name}.{range_name}.woff2"
                font.flavor = "woff2"
                font.save(os.path.join(out_dir, "assets", font_url))
                font_list.append((font_url, subrange))
                print(f"[{self.font_name}.{range_name}]: Found {len(font.getGlyphOrder()) - 1} glyphs for {len(cmap)} out of {len(unicodes)} unicodes")
            else:
                print(f"[{self.font_name}.{range_name}]: Found no glyphs for any of {len(unicodes)} unicodes")
            font.close()
        with open(os.path.join(out_dir, "lib", f"{self.font_name}.css"), "w") as file:
            for font_url, subrange in font_list:
                print("@font-face {", file=file)
                print(f'  font-family: "{self.font_family}";', file=file)
                print(f"  font-weight: {self.font_weight};", file=file)
                print(f"  font-style: {self.font_style};", file=file)
                print(f"  font-display: swap;", file=file)
                print(f'  src: url("../assets/{font_url}") format("woff2");', file=file)
                print(f"  unicode-range: {subrange};", file=file)
                print("}", file=file)


def generate(font_file, font_name, font_weight=None, font_style=None):
    Tool(font_file, font_name, font_weight, font_style).generate()


def main():
    generate("Open_Sans/static/OpenSans-Regular.ttf", "opensans")
    generate("Open_Sans/static/OpenSans-Italic.ttf", "opensans")
    generate("Open_Sans/static/OpenSans-Bold.ttf", "opensans")
    generate("Open_Sans/static/OpenSans-BoldItalic.ttf", "opensans")
    generate("Roboto_Mono/static/RobotoMono-Regular.ttf", "roboto-mono")
    generate("Roboto_Mono/static/RobotoMono-Italic.ttf", "roboto-mono")
    generate("Roboto_Mono/static/RobotoMono-Bold.ttf", "roboto-mono")
    generate("Roboto_Mono/static/RobotoMono-BoldItalic.ttf", "roboto-mono")
    generate("ubuntu-font-family-0.83/UbuntuMono-R.ttf", "ubuntu-mono")
    generate("ubuntu-font-family-0.83/UbuntuMono-RI.ttf", "ubuntu-mono")
    generate("ubuntu-font-family-0.83/UbuntuMono-B.ttf", "ubuntu-mono")
    generate("ubuntu-font-family-0.83/UbuntuMono-BI.ttf", "ubuntu-mono")


if __name__ == "__main__":
    main()
