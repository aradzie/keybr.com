#!/bin/env python3

# https://markoskon.com/creating-font-subsets/

from fontTools.merge import Merger, Options
from fontTools.subset import parse_unicodes, Subsetter
from fontTools.ttLib import TTFont

unicode_ranges = [
    ("arabic", "U+0600-06FF"),
    ("cyrillic", "U+0400-04FF"),
    ("greek", "U+0370-03FF"),
    ("hebrew", "U+0590-05FF"),
    ("latin", "U+0000-00FF, U+2000-206F, U+2200-22FF, U+E000-E003"),
    ("latin-ext", "U+0100-017F, U+0180-024F, U+0300-036F, U+20A0-20CF"),
    ("thai", "U+0E01-0E5B"),
]


class Font:
    def __init__(self, font_name, font_file, merge_file=None):
        self.font_file = font_file
        self.merge_file = merge_file

        font = TTFont(font_file, lazy=True)
        font_family = font["name"].getDebugName(1)
        font_subfamily = font["name"].getDebugName(2)
        font.close()

        self.font_family = font_family
        self.font_subfamily = font_subfamily

        if font_subfamily == "Thin":
            self.font_weight = 100
            self.font_style = "normal"
        if font_subfamily == "Thin Italic":
            self.font_weight = 100
            self.font_style = "italic"
        if font_subfamily == "Extra Light":
            self.font_weight = 200
            self.font_style = "normal"
        if font_subfamily == "Extra Light Italic":
            self.font_weight = 200
            self.font_style = "italic"
        if font_subfamily == "Light":
            self.font_weight = 300
            self.font_style = "normal"
        if font_subfamily == "Light Italic":
            self.font_weight = 300
            self.font_style = "italic"
        if font_subfamily == "Regular":
            self.font_weight = 400
            self.font_style = "normal"
        if font_subfamily == "Italic":
            self.font_weight = 400
            self.font_style = "italic"
        if font_subfamily == "Medium":
            self.font_weight = 500
            self.font_style = "normal"
        if font_subfamily == "Medium Italic":
            self.font_weight = 500
            self.font_style = "italic"
        if font_subfamily == "Bold":
            self.font_weight = 700
            self.font_style = "normal"
        if font_subfamily == "Bold Italic":
            self.font_weight = 700
            self.font_style = "italic"
        if font_subfamily == "Extra Bold":
            self.font_weight = 800
            self.font_style = "normal"
        if font_subfamily == "Extra Bold Italic":
            self.font_weight = 800
            self.font_style = "italic"
        if font_subfamily == "Black":
            self.font_weight = 900
            self.font_style = "normal"
        if font_subfamily == "Black Italic":
            self.font_weight = 900
            self.font_style = "italic"

        self.font_name = f"{font_name}-{self.font_weight}italic" if self.font_style == "italic" else f"{font_name}-{self.font_weight}"

    def generate(self):
        font_list = []
        for range_name, subrange in unicode_ranges:
            unicodes = parse_unicodes(subrange)
            if self.merge_file:
                merger = Merger(options=Options(drop_tables=["vhea", "vmtx"]))
                font = merger.merge([self.font_file, self.merge_file])
            else:
                font = TTFont(self.font_file)
            subs = Subsetter()
            subs.populate(unicodes=unicodes)
            subs.subset(font)
            cmap = font.getBestCmap()
            if cmap and len(cmap) >= 10:
                font_url = f"{self.font_name}.{range_name}.woff2"
                font.flavor = "woff2"
                font.save(f"assets/{font_url}")
                font_list.append((font_url, subrange))
                print(
                    f"[{self.font_name}.{range_name}]: "
                    + f"Found {len(font.getGlyphOrder()) - 1} glyphs "
                    + f"for {len(cmap)} out of {len(unicodes)} unicodes"
                )
            font.close()
        css = []
        for font_url, subrange in font_list:
            item = f"""@font-face {{
  font-family: "{self.font_family}";
  font-weight: {self.font_weight};
  font-style: {self.font_style};
  font-display: swap;
  src: url(../../assets/{font_url}) format("woff2");
  unicode-range: {subrange};
}}"""
            css.append(item)
        css.append("")
        with open(f"lib/fonts/{self.font_name}.css", "w") as file:
            print("\n".join(css), end="", file=file)


def generate(font_name, font_file, merge_file=None):
    Font(font_name, font_file, merge_file).generate()


def main():
    generate("arad", "fonts/Arad/main/static/ttf/Arad-Regular.ttf")
    generate("arad", "fonts/Arad/main/static/ttf/Arad-Bold.ttf")
    generate("cormorant", "fonts/Cormorant/static/Cormorant-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("cormorant", "fonts/Cormorant/static/Cormorant-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("cormorant", "fonts/Cormorant/static/Cormorant-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("cormorant", "fonts/Cormorant/static/Cormorant-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("newsreader", "fonts/Newsreader/static/Newsreader_60pt-Regular.ttf", merge_file="Whitespace-em2000.ttf")
    generate("newsreader", "fonts/Newsreader/static/Newsreader_60pt-Italic.ttf", merge_file="Whitespace-em2000.ttf")
    generate("newsreader", "fonts/Newsreader/static/Newsreader_60pt-Bold.ttf", merge_file="Whitespace-em2000.ttf")
    generate("newsreader", "fonts/Newsreader/static/Newsreader_60pt-BoldItalic.ttf", merge_file="Whitespace-em2000.ttf")
    generate("nunito", "fonts/Nunito/static/Nunito-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("nunito", "fonts/Nunito/static/Nunito-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("nunito", "fonts/Nunito/static/Nunito-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("nunito", "fonts/Nunito/static/Nunito-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("open-dyslexic", "fonts/OpenDyslexic/OpenDyslexic-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("open-dyslexic", "fonts/OpenDyslexic/OpenDyslexic-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("open-dyslexic", "fonts/OpenDyslexic/OpenDyslexic-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("open-dyslexic", "fonts/OpenDyslexic/OpenDyslexic-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("open-sans", "fonts/OpenSans/static/OpenSans-Regular.ttf", merge_file="Whitespace-em2048.ttf")
    generate("open-sans", "fonts/OpenSans/static/OpenSans-Italic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("open-sans", "fonts/OpenSans/static/OpenSans-Bold.ttf", merge_file="Whitespace-em2048.ttf")
    generate("open-sans", "fonts/OpenSans/static/OpenSans-BoldItalic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto", "fonts/Roboto/Roboto-Regular.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto", "fonts/Roboto/Roboto-Italic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto", "fonts/Roboto/Roboto-Bold.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto", "fonts/Roboto/Roboto-BoldItalic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto-mono", "fonts/RobotoMono/static/RobotoMono-Regular.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto-mono", "fonts/RobotoMono/static/RobotoMono-Italic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto-mono", "fonts/RobotoMono/static/RobotoMono-Bold.ttf", merge_file="Whitespace-em2048.ttf")
    generate("roboto-mono", "fonts/RobotoMono/static/RobotoMono-BoldItalic.ttf", merge_file="Whitespace-em2048.ttf")
    generate("rubik", "fonts/Rubik/static/Rubik-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("rubik", "fonts/Rubik/static/Rubik-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("rubik", "fonts/Rubik/static/Rubik-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("rubik", "fonts/Rubik/static/Rubik-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("shantell-sans", "fonts/Shantell_Sans/static/ShantellSans-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("shantell-sans", "fonts/Shantell_Sans/static/ShantellSans-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("shantell-sans", "fonts/Shantell_Sans/static/ShantellSans-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("shantell-sans", "fonts/Shantell_Sans/static/ShantellSans-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("spectral", "fonts/Spectral/Spectral-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("spectral", "fonts/Spectral/Spectral-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("spectral", "fonts/Spectral/Spectral-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("spectral", "fonts/Spectral/Spectral-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu", "fonts/Ubuntu/Ubuntu-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu", "fonts/Ubuntu/Ubuntu-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu", "fonts/Ubuntu/Ubuntu-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu", "fonts/Ubuntu/Ubuntu-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu-mono", "fonts/Ubuntu_Mono/UbuntuMono-Regular.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu-mono", "fonts/Ubuntu_Mono/UbuntuMono-Italic.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu-mono", "fonts/Ubuntu_Mono/UbuntuMono-Bold.ttf", merge_file="Whitespace-em1000.ttf")
    generate("ubuntu-mono", "fonts/Ubuntu_Mono/UbuntuMono-BoldItalic.ttf", merge_file="Whitespace-em1000.ttf")


if __name__ == "__main__":
    main()
