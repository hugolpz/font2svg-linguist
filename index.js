/* takes in entry :                        */
/* ************************************************************************* */
/* INIT variables ********************************************************** */
let DATAJSONFILE = "",
	DATAJSONKEY = "",
	FILESUFFIX = "-songti.svg",
	DIR = "./build/",
	FONTPATH = "",
	FONTOPTION = "nonSerif";
let STYLE = "top",
	WIDTH = "",
	HEIGHT = "",
	MARGIN_TOP = "",
	MARGIN_RIGHT = "",
	MARGIN_BOTTOM = "",
	MARGIN_LEFT = "";

/* ************************************************************************* */
/* Toolings **************************************************************** */
const fs = require('fs');
const TextToSVG = require('text-to-svg');
const unihan = require('unihan');
const cjkUnihan = require('cjk-unihan');
cjkUnihan.get("我", function(err, result){ console.log("Full lookup all done:", result); });

fs.mkdir(DIR, 0o700, err => { if (err) { console.log('./build folder already exists'); } });

/* ************************************************************************* */
/* Set fonts for glyph and annotation ************************************** */
const fonts = {
	"ukai"     : './fonts/ukai.ttc', "comment": "",
	"nonSerif" : './fonts/noto/NotoSerifCJKtc-Medium.otf', "comment": "",
	"nonSans"  : './fonts/noto/NotoSansTC-Medium.otf', "comment": "",
	"cwtex"    : './fonts/cwtex/cwTeXQKaiZH-Medium.ttf', "comment": "traditional characters, no simplified, radicals to extract from others",
	"xinshu"   : './fonts/hyi1gf.ttf', "comment": "for CN users, store traditional glyph on simplified unicode points." // m = 汉仪行楷繁
};
const textToSVGglyph = TextToSVG.loadSync(FONTPATH || fonts[FONTOPTION]) || TextToSVG.loadSync(); 	// custom font, or then default
const textToSVGannotation = TextToSVG.loadSync();																										// local custom font

/* ************************************************************************* */
/* Load list of characters ************************************************* */
DATAJSONFILE = [ "./data/kangxi-rad-to-char.json", "./data/lists-cmn.json", "data/unihan.json" ]
let loaded = require(DATAJSONFILE[1]), data = "";
loaded.lists ? data = loaded.lists[9].list : data = loaded;
typeof data === 'string'? data = data.split("") : data = data;
console.log("JSON data, proccessed:", data);


/* ************************************************************************* */
/* CLEAN UP UNIHAN ********************************************************* *
var unihan = unihanRaw.map(function(obj) {
    return {
        char: obj.char,
        kMandarin: obj.kMandarin
    }
})
var unihanReady = unihanRaw.map(function(obj) {
    return obj.char : {
        glyph: obj.char,
        annotation: obj.kMandarin
    }
})
/* ************************************************************************* */

/* ************************************************************************* */
/* SVG outline and style *************************************************** */
var doc = { width: 300, height: 300 };
var margin = { top: 15, right: 15, bottom: 15, left: 15 };
var glyph = {
	width :  doc.width - margin.left - margin.right,
  height : doc.height - margin.top - margin.bottom,
	middle : doc.width/2,
	center : doc.height/2
};
console.log(doc);
console.log(margin);
console.log(glyph);

// All possibles styles
const styles = {
	"top": {
	  glyph : {
			x: glyph.middle, y: glyph.height-margin.top, fontSize: glyph.height/25*27, anchor: 'center',
			attributes: { fill: '#000', 'font-family':'cwTeX Q KaiZH','font-weight':'bold','font-style':'normal' } // the font-* DO NOT work
		},
		annotation : {
			x: glyph.middle, y: 20, fontSize: 40, anchor: 'middle center', attributes:
			{ fill: '#666','font-weight':'bold','font-style':'italic' } // the font-* DO NOT work
		},
	}
	/* Various other configuations for annotations *************************** **
	,"bottom" : { },
	"left-downward" : { },
	"left-upward" : { },
	"
	right-downward" : { },
	"right-upward" : { } ***************************************************** */
};
// Chosen style
var style = styles["top"];
console.log(style)

/* ************************************************************************* */
/* LOOOP WRITING SVGS ****************************************************** */
for (let char of data) {
	let l = Object.keys("西").length || char.length;
	console.log(l >1? "array !!!"+l+"-"+char.length: "character!"+l+"-"+char.length)

	// Create svg, then paths
	let glyph		= char.glyph || char,
	prefix			= char.file || char,
	annotation	= char.annotation || "";
	let svgGlyph      = textToSVGglyph.getPath(glyph, style.glyph);
	let svgAnnotation = textToSVGannotation.getPath(annotation, style.annotation) || '';
	//Create valid svg file's data
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="`+doc.width+`" height="`+doc.height+`" style="border:1px solid #666">`
	    + svgGlyph
	    + svgAnnotation
	    + `</svg>`;
	// Print to file
	let fileName = prefix +FILESUFFIX;
	fs.writeFile(DIR+ fileName, svg);
	// Few feedbacks
	console.log('File data : '+JSON.stringify([ char, char[0], char.file, char.glyph, char.annotation]));
	console.log('File generation : '+DIR+fileName);
}
