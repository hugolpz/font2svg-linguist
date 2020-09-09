/* takes in entry :                        */
/* ************************************************************************* */
/* Toolings **************************************************************** */
const fs = require('fs');
const TextToSVG = require('text-to-svg');
//const unihan = require('unihan');
const cjkUnihan = require('cjk-unihan');

/* ************************************************************************* */
/* INIT variables ********************************************************** */
let DATAJSONFILES= process.env.DATAJSONFILES|| [ "./data/kangxi-rad-to-char.json", "./data/lists-cmn.json", "data/unihan.json" ],
	DATAJSONKEY  = process.env.DATAJSONKEY || "", // to review
	FILESUFFIX   = process.env.FILESUFFIX  || "-kaishu.svg",
	DIR       = process.env.DIR || "./build/",
	FONTPATH  = process.env.FONTPATH   || "./fonts/edukai-3.ttf",
	FONTOPTION= process.env.FONTOPTION || "edukai";
let STYLE  = process.env.STYLE  || "top", // to review
	WIDTH  = process.env.WIDTH  || 300,
	HEIGHT = process.env.HEIGHT || 300,
	margins= process.env.MARGINS.split(' '), // ex: "15 15 15 15" // to review
	MARGINS= { top: margins[0], right: margins[1], bottom: margins[2], left: margins[3] } || { top: HEIGHT*0.05, right: WIDTH*0.05, bottom: HEIGHT*0.05, left: WIDTH*0.05 },


/* ************************************************************************* */
/* Folder tree ************************************************************* */
fs.mkdir(DIR, 0o700, err => { if (err) { console.log('./build folder already exists'); } });

/* ************************************************************************* */
/* Test cjkUnihan ********************************************************** */
cjkUnihan.get("我", function(err, result){ console.log("Full lookup all done:", result); });

/* ************************************************************************* */
/* Set fonts for glyph and annotation ************************************** */
const fonts = {
	"edukai"  : './fonts/edukai-3.ttf', "comment": "TW! 教育部標準楷書字形檔 http://creativecommons.org/licenses/by-nd/3.0/tw/",
	"xingkai" : './fonts/STXingkai.ttf', "comment": "http://www.wildboar.net/multilingual/asian/chinese/language/fonts/unicode/non-microsoft/non-microsoft.html",
	"xiaozhuan":'./fonts/FZXiaoZhuanTi.ttf', "comment": "http://www.wildboar.net/multilingual/asian/chinese/language/fonts/unicode/non-microsoft/non-microsoft.html",
	"lishu1"  : './fonts/UnYetgul.ttf', "comment": "trad only, http://www.wildboar.net/multilingual/asian/chinese/language/fonts/unicode/non-microsoft/non-microsoft.html",
	"lishu2"  : './fonts/HanWangLiSuMedium.ttf', "comment": "trad only, http://www.wildboar.net/multilingual/asian/chinese/language/fonts/unicode/non-microsoft/non-microsoft.html",
	"zhuyin"  : './fonts/HanWangKaiMediumChuIn.ttf', "comment":'http://www.wazu.jp/gallery/Fonts_ChineseTraditional.html',
	"ukai"    : './fonts/ukai.ttc', "comment": "",
	"nonSerif": './fonts/noto/NotoSerifCJKtc-Medium.otf', "comment": "",
	"nonSans" : './fonts/noto/NotoSansTC-Medium.otf', "comment": "",
	"cwtex"   : './fonts/cwtex/cwTeXQKaiZH-Medium.ttf', "comment": "traditional characters, no simplified, radicals to extract from others",
	"xinshu"  : './fonts/hyi1gf.ttf', "comment": "for CN users, store traditional glyph on simplified unicode points." // m = 汉仪行楷繁
};

var fontPath = FONTPATH || fonts[FONTOPTION];
const textToSVGglyph = TextToSVG.loadSync(fontPath) || TextToSVG.loadSync(); 	// custom font, or then default
const textToSVGannotation = TextToSVG.loadSync();																										// local custom font

/* ************************************************************************* */
/* Load list of characters ************************************************* */
let loaded = require(DATAJSONFILES[1]), 
	data = "";
loaded.lists ? data = loaded.lists[8].list : data = loaded;
typeof data === 'string'? data = data.split("") : data = data;
console.log("JSON data, proccessed:", data);


/* ************************************************************************* */
/* TO EXPORT : CLEAN UP UNIHAN ********************************************* *
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
var margin= { top: 15, right: 15, bottom: 15, left: 15 }; // duplication of init variables // to review
var glyph = {
	width : WIDTH - MARGINS.left - MARGINS.right,
	height: HEIGHT - MARGINS.top - MARGINS.bottom,
	middle: WIDTH/2,
	center: WIDTH/2
};
console.log(margin);
console.log(glyph);

// All possibles styles
const styles = {
	"top": {
	  glyph : {
			x: glyph.middle, y: glyph.height-MARGINS.top, fontSize: glyph.height/25*27, anchor: 'center',
			attributes: { fill: '#000', 'font-family':'cwTeX Q KaiZH','font-weight':'bold','font-style':'normal' } },
		annotation : {
			x: glyph.middle, y: 20, fontSize: 40, anchor: 'middle center',
			attributes: { fill: '#666','font-weight':'bold','font-style':'italic' } },
	},
	"bottom" : {
		glyph : {
			x: glyph.middle, y: glyph.height-MARGINS.top, fontSize: glyph.height/25*27, anchor: 'center',
			attributes: { fill: '#000', 'font-family':'cwTeX Q KaiZH','font-weight':'bold','font-style':'normal' } },
		annotation : {
			x: glyph.middle, y: 280, fontSize: 40, anchor: 'middle center', 
			attributes: { fill: '#666','font-weight':'bold','font-style':'italic' } },
	}
/* Various other configuations for annotations *************************** **,
	"left-downward" : { },
	"right-downward" : { } ***************************************************** */
};
// Chosen style
var style = styles[STYLE]; // "top" to review
console.log(style)

/* ************************************************************************* */
/* LOOOP WRITING SVGS ****************************************************** */
for (let char of data) {
	// test if loading rich object { ,..., }
	let l = Object.keys("西").length || char.length;
	console.log(l >1? "array !!!"+l+"-"+char.length: "character!"+l+"-"+char.length)

	// Create svg, then paths
	let glyph 	= char.glyph || char,
	filePrefix 		= char.file || char,
	annotation 	= char.annotation || "";
	let svgGlyph = textToSVGglyph.getD(glyph, style.glyph),
		svgAnnotation = textToSVGannotation.getD(annotation, style.annotation);
	let svgGlyphPath  = svgGlyph? `<path fill="#000" id="glyph" d="`+svgGlyph+`"/>`:'',
		svgAnnotationPath = annotation.length>0? `<path fill="#000" id="annotation" d="`+svgAnnotation+`"/>` :'';
	//Create valid svg file's data
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="`+doc.width+`" height="`+doc.height+`" style="border:1px solid #666">`
		+ svgGlyphPath
		+ svgAnnotationPath
    + `</svg>`;
	// Print to file
	let fileName = filePrefix + FILESUFFIX;
	fs.writeFile(DIR + fileName, svg);
	// Few feedbacks
	console.log('File data : '+JSON.stringify([ char, char[0], char.file, char.glyph, char.annotation]));
	console.log('File generation : '+DIR+fileName);
}
