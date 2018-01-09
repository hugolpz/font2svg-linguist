# font2svgfiles

> Early draft : informations below might not accurate while this message is present.

## Input/Output
**Input:** a free license unicode font, a json listing of (CJK) unicode characters, potentially with annotation.

**Output :** serie of svg files with the glyph and optionally with the pinyin such as `{yourCharacter}-{type}.svg`.

<p align="center">
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-top.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-bottom.png?raw=true" alt="Schematic image"/>
  </p>
  <p align="center">
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-left-downward.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-left-upward.png?raw=true" alt="Schematic image"/>
  </p>
  <p align="center">
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-right-downward.png?raw=true" alt="Schematic image"/>
  <img width="100px" src="https://github.com/edouard-lopez/Hanzi-Pinyin-Font/blob/master//resources/tpl/annotation-right-upward.png?raw=true" alt="Schematic image"/>
</p>

And flexibility for other variants.

## Software requirements

* Required : `nodejs`, [`NPM`](http://npmjs.org/)
* Optional : git

## Install

	npm install

## Usage
First, edit ./index.js in orther to set the initial variable to your convenience. Then :

	npm start

## Fonts

* [Noto Sans CJK](https://github.com/googlei18n/noto-cjk) as it [support Chinese and is under open licence](https://www.wikiwand.com/en/Noto_fonts).
* Other fonts
* Note: some font files may returns `Error('Unsupported OpenType signature ' + signature);new Error('Unsupported OpenType signature ' + signature);`

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
