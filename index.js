/* takes in entry :                        */
// Tooling
const fs = require('fs');
const TextToSVG = require('text-to-svg');
// Define fonts for ort and pho
const fonts = {
	"ukai" : './fonts/ukai.ttc',
	"nonSerif" : './fonts/noto/NotoSerifCJKtc-Medium.otf',
	"nonSans" : './fonts/noto/NotoSansTC-Medium.otf',
	"cwTex" : './fonts/cwtex/cwTeXQKaiZH-Medium.ttf',
};
const textToSVGort = TextToSVG.loadSync(fonts.cwTex) || TextToSVG.loadSync(); // default font for ort
const textToSVGpho = TextToSVG.loadSync(); 																					// local custom font for pho

// Load list of character
const data = require('./data/lists-cmn.json');  console.log("JSON data.lists[0]:", data.lists[0]);
const list = data.lists[0].list.split("");      console.log("JSON list:", list);
const kangxi = require('./data/kangxi-rad-to-char.json');  console.log("JSON kangxi[0]:", kangxi[0]);

fs.mkdir('./build', 0o700, err => { if (err) { console.log('./build folder already exists'); } });

/* Variables values
var list = [
	{ ort: '西', pho: 'xī', style: 'top' },
	{ ort: '中', pho: 'zhong1', style: 'top' }
]; */

// Define SVG outline
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
const styles= {
	"top": {
	  ort : {
			x: glyph.middle, y: glyph.height-margin.top, fontSize: glyph.height/25*27, anchor: 'center',
			attributes: { fill: '#000', 'font-family':'cwTeX Q KaiZH','font-weight':'bold','font-style':'normal' } // the font-* DO NOT work
		}
		,pho : { x: glyph.middle, y: 20, fontSize: 40, anchor: 'middle center', attributes:
			{ fill: '#666','font-weight':'bold','font-style':'italic' } // the font-* DO NOT work
		},
	},
	"bottom" : { },
	"left-downward" : { },
	"left-upward" : { },
	"right-downward" : { },
	"right-upward" : { }
};
console.log(styles.top.ort)

for (let char of kangxi) {
	// Active style
	var style = styles[char.style] || 'top';
	// Create svg, then paths
	const svgOrt = textToSVGort.getPath(char.ort || char.char, style.ort || styles.top.ort);
	const svgPho = textToSVGpho.getPath(char.pho || char.en, style.pho || styles.top.pho) || '';
	//Create valid svg file's data
	var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="`+doc.width+`" height="`+doc.height+`" style="border:1px solid #666">`
	    + svgOrt
	    + svgPho
	    + `</svg>`;
	// Print to file
	const fileName = char.rad +'-kaishu.svg';
	fs.writeFile('./build/'+ fileName, svg);
	// Few feedbacks
	console.log('File generation : done.');
	console.log('File data : '+JSON.stringify([ char.ort, char.rad, char.char, char.en]));
	console.log('File location : ./build/'+fileName);
}
