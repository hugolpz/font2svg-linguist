# font2svgfiles

## Install

```bash
git clone --recurse-submodules git@github.com:hugolpz/font2svg-linguist.git
cd font2svg-linguist
npm install
```

## Input/Output
**Input:** a free license unicode font, a json array of (CJK) unicode characters such as :

**Output :** serie of svg files `{yourCharacter}-{type}.svg` with the glyph and optionally with annotations, such as pinyin, English, or other. Seel gallery of examples below.

<p align="center">
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-top.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-bottom.png?raw=true" alt="Schematic image"/>
  </p>
  <p align="center">
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-left-downward.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-left-upward.png?raw=true" alt="Schematic image"/>
  </p>
  <p align="center">
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-right-downward.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/hugolpz/font2svg-linguist/blob/master//doc/tpl/annotation-right-upward.png?raw=true" alt="Schematic image"/>
</p>

And flexibility for other variants.

## Usage
The script is still best used by hacking `./index.js` in order to set the initial variables to your convenience. You may also use is via shell commands and options (see below).

#### Run

```bash
# load font kaishu,ANNOTATIONFIELD= unihan field `kMandarin` for annotations, use provided list `Kangxi_radicals_214`
$ FONTOPTION=kaishu ANNOTATIONFIELD=kMandarin LISTNAME=Kangxi_radicals_214 node index.js   
```

#### Options

* `GLYPHS`: list of characters to split an process.
  * ex: `一二三`
* `LISTNAME`: list of characters loaded from _./data/cmn-lists.json_.
  * default: ``
  * range: `Hangul_letters`,`Kangxi_radicals_214`,`Subtlex_3000`,`Junda_3000`,`Taiwan_3000`,`HSK1`,`HSK2`,`HSK3`,`HSK4`,`HSK5`,`HSK6`,`France_255`,`France_355`,`France_400`,`France_405`,`AFPC_505`,`France_805`,`France_1555`
* `ANNOTATIONFIELD`: key to tap into Unihan for annotations. Generated thanks to [Unihan-etl](//github.com/cihai/unihan-etl). For respective definitions, see [Unicode's Unihan](https://unicode.org/reports/tr38/#AlphabeticalListing).
  * default: ``
  * range:  `char`,`kRSKangXi`,`kTotalStrokes`,`kMandarin`,`kDefinition`,`kCantonese`,`kJapaneseOn`,`kJapaneseKun`,`kKorean`,`kVietnamese`,`kFrequency`,`kTang`,`kSimplifiedVariant`,`kTraditionalVariant`,`kHangul`
* `FILESUFFIX` : general filename's suffixe for the current serie of files.
  * default: `'-kaishu.svg'`
* `DIR` : where to output the files.
  * default: `'./build/'`
* `FONTPATH` : path to the chosen font.
  * default: `'./fonts/cwtex/cwTeXQKaiZH-Medium.ttf'`
* `FONTOPTION` : some fonts are provided via ./fonts/cjkfonts.js, use the json object's key.
  * default: `cwtex`
  * range: `kaishu`, `cwtex`
* `STYLE` : where to position annotations, relative to the character.
  * default: `'top'`
  * range: `'top'`, `'bottom'`,
* `WIDTH` : the document wished width in pixels.
  * default: `300`
  * range: `>0`
* `HEIGHT` : the document wished height in pixels.
  * default: `300`
  * range: `>0`
* `MARGINS` : the margins sizes between the character and the document's border, defines the character's size by substractions. Order is `top`, `right`, `bottom`, `left`, like in `CSS`.
  * default: `'15 15 15 15'`
  * range: `'>0 >0 >0 >0'`


## Meta-data
I use Unihan data for Chinese, processed via [Unihan-etl](https://github.com/cihai/unihan-etl) :

```
cd unihan-etl
unihan-etl -F json --destination ./unihan-language-fields.json --no-expand -f kRSKangXi kTotalStrokes kMandarin kDefinition kCantonese kJapaneseOn kJapaneseKun kKorean kVietnamese kFrequency kTang kSimplifiedVariant kTraditionalVariant kHangul
```

## Fonts

* Open [CJKV fonts](https://en.wikipedia.org/wiki/List_of_CJK_fonts):
  * [Noto Sans CJK](https://github.com/googlei18n/noto-cjk) as it [support Chinese and is under open licence](https://www.wikiwand.com/en/Noto_fonts).
  * AR PL UMing,	AR PL UKai, AR PL ShanHeiSun,	AR PL ZenKai, cwTeXQKaiZH-Medium.ttf, cwTeXQMingZH-Medium.ttf from [](http://zenozeng.github.io/Free-Chinese-Fonts/)
* Other fonts

Note: some font files may returns `Error('Unsupported OpenType signature ' + signature);new Error('Unsupported OpenType signature ' + signature);`

## Motivation

This system is build to satisfy the Wikimedia [Commons:Ancient Chinese Characters Project](https://commons.wikimedia.org/wiki/Commons:Ancient_Chinese_characters_project). It help to provide multi-system and solid .svg / .png solutions to display Chinese characters. Priority being to display in the 6 traditional calligraphic styles the ~400 Kangxi radicals and 1000 most common characters.

The system could be expanded and used for other usages.

## License

> Copyright (C) 2013 Hanzi Pinyin Font Project
>
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>      http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
