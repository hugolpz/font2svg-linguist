//Run: $ ANNOTATIONFIELD='kMandarin' node index.js 
/* takes in entry :                        */
/* ************************************************************************* */
/* Toolings **************************************************************** */
const fs = require('fs');
const TextToSVG= require('text-to-svg');
const cjkfonts = require('./fonts/cjkfonts.js'); // personal fonts

/* ************************************************************************* */
/* INIT variables ********************************************************** */
let GLYPHS = process.env.GLYPHS || undefined, // ex: 'ABCD...'
  ANNOTATIONFIELD = process.env.ANNOTATIONFIELD, // ex: 'kMandarin', "kDefinition", 
  CMNLISTNAME = process.env.CMNLISTNAME || "Kangxi_radicals_214",
  FILESUFFIX = process.env.FILESUFFIX || '-kaishu.svg',
  DIR = process.env.DIR || './build/',
  FONTOPTION = process.env.FONTOPTION || 'kaishu',
  FONTPATH = process.env.FONTPATH || './fonts/cwtex/cwTeXQKaiZH-Medium.ttf';
let STYLE = process.env.STYLE || 'top',
  WIDTH = process.env.WIDTH || 300,
  HEIGHT = process.env.HEIGHT || 300,
  margins = process.env.MARGINS, // ex: '15 15 15 15' // to review
  MARGINS = margins ? {
    top: margins[0],
    right: margins[1],
    bottom: margins[2],
    left: margins[3]
  } : {
    top: HEIGHT*0.05,
    right: WIDTH*0.05,
    bottom: HEIGHT*0.05,
    left: WIDTH*0.05
  };


/* ************************************************************************* */
/* Load characters list, unihan. Output: {glyph:'屮', annotation:'sprout'} * */
const cmnList= JSON.parse(fs.readFileSync('./data/cmn-lists.json', 'utf8'));
const unihanRaw = JSON.parse(fs.readFileSync('./data/UNIHAN-SELECTED-FIELDS.json', 'utf8'));
const selectedList = cmnList.lists.find(item => item.name==CMNLISTNAME); //"Kangxi_radicals_214" // USE SEARCH ? // Selects list from cmnLists.json
const selectedChars = typeof GLYPHS === 'string' ? GLYPHS.split('') : selectedList.list.split('');
console.log('selectedChars: ',selectedChars.join())
unihanSelectedChars = unihanRaw.filter((char) => selectedChars.includes(char.char))
console.log('dictOfSelected[0]: ',unihanSelectedChars[0])
var keepFirstWord = function(str){ 
  return str?str.replace(/ ?KangX.+?\d+/gi,'').split(';')[0].split(',')[0].split(' or ')[0]:''; 
};
dict = unihanSelectedChars.map( item => {
  return {
    glyph: item.char, 
    annotation:keepFirstWord(item[ANNOTATIONFIELD]),
    phonetic: item['kMandarin'], // not used, just a human friendly helper.
  }
});
console.log('dict[0] (reduced): ',dict[0])


/* ************************************************************************* */
/* Test cjkUnihan ********************************************************** 
const cjkUnihan= require('cjk-unihan');
var zi = '我';
cjkUnihan.get(zi, function(err, result) {
  console.log('cjkUnihan query on ' + zi + ': ', result);
});
*/


/* ************************************************************************* */
/* Folder tree ************************************************************* * /
fs.mkdirSync(DIR, 0o700, err => {
  if (err) {
    console.log('./build folder already exists');
  }
}); */


/* ************************************************************************* */
/* SVG outline and style *************************************************** */
var margin = {
  top: 15,
  right: 15,
  bottom: 15,
  left: 15
}; // duplication of init variables // to review
var glyph = {
  width:  WIDTH - MARGINS.left - MARGINS.right,
  height: (HEIGHT - MARGINS.top - MARGINS.bottom) *1.08,// 8% cancels in-font's padding.
  middle: WIDTH / 2,
  vcenter: WIDTH / 2 -7,  // 7px cancels in-font's vertical biaise (downward), we reduce distance from top by 7px
};
console.log(margin);
console.log(glyph);

// All possibles styles
const styles = {
  'top': {
    glyph: {
      x: glyph.middle,
      y: `${ANNOTATIONFIELD? glyph.vcenter+40/2:glyph.vcenter}`, // if annotation, increase distance from top (increase margin-top)
      fontSize: `${ANNOTATIONFIELD? glyph.height-40/2: glyph.height}`, // if annotation, increase reduce font-size
      anchor: 'middle center',
      attributes: {
        fill: '#000',
        //'font-family': 'cwTeX Q KaiZH',
        'font-weight': 'bold',
        'font-style': 'normal'
      }
    },
    annotation: {
      x: glyph.middle,
      y: 20,
      fontSize: 40,
      anchor: 'middle center',
      attributes: {
        fill: '#666',
        'font-weight': 'bold',
        'font-style': 'italic'
      }
    },
  },
  'bottom': {
    glyph: {
      x: glyph.middle,
      y: glyph.height - MARGINS.top,
      fontSize: glyph.height / 25 * 27,
      anchor: 'center',
      attributes: {
        fill: '#000',
        'font-family': 'cwTeX Q KaiZH',
        'font-weight': 'bold',
        'font-style': 'normal'
      }
    },
    annotation: {
      x: glyph.middle,
      y: 280,
      fontSize: 40,
      anchor: 'middle center',
      attributes: {
        fill: '#666',
        'font-weight': 'bold',
        'font-style': 'italic'
      }
    },
  }
  /* Various other configuations for annotations *************************** **,
  	'left-downward' : { },
  	'right-downward' : { } ***************************************************** */
};
// Chosen style
var style = styles[STYLE]; // 'top' to review
console.log(style)


/* ************************************************************************* */
/* FONT LOADING ************************************************************ */
var fontPath = cjkfonts[FONTOPTION].fontpath || FONTPATH ;
const textToSVGglyph = fontPath ? TextToSVG.loadSync(fontPath) : TextToSVG.loadSync(); // custom font, else default
const textToSVGannotation = TextToSVG.loadSync(); // default font

/* ************************************************************************* */
/* LOOOP WRITING SVGS ****************************************************** */
for (let char of dict) {
  console.log('Char is: ',char);

  // Create svg, then paths  
  let glyph = char.glyph || char,
    annotation = char.annotation || '';
  let svgGlyph = textToSVGglyph.getD(glyph, style.glyph),
    svgAnnotation = textToSVGannotation.getD(annotation, style.annotation);
  let svgGlyphPath = svgGlyph ? `<path id='glyph' content='${glyph}' fill='#000' d='${svgGlyph}'/>` : '',
    svgAnnotationPath = annotation.length > 0 ? `<path id='annotation' content="${annotation.replace(/\"/g,"'")}"  fill='#000' d='${svgAnnotation}'/>` : '';
  //Create valid svg file's data
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='${WIDTH}' height='${HEIGHT}' style='border:1px solid #666'>
  ${svgGlyphPath}
  ${svgAnnotationPath?svgAnnotationPath:''}
</svg>`;


  // Create target filepath
  let filePrefix = char.glyph || char,
      filepath = DIR + filePrefix + FILESUFFIX;
  console.log('filepath',filepath);
  // Print to file
  fs.writeFileSync(filepath, svg);
  console.log('/* Printed ! ******************************************************************* */');
}
