import { DOMImplementation, XMLSerializer } from 'xmldom';
// import * as svg2img from 'svg2img';
const svg2img = require('svg2img');
import { writeFileSync } from 'fs';
var JsBarcode = require('jsbarcode');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument(
  'http://www.w3.org/1999/xhtml',
  'html',
  null
);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

JsBarcode(svgNode, '5454545454', {
  xmlDocument: document
});

const svgText = xmlSerializer.serializeToString(svgNode);

svg2png(svgText)
  .then(res => {
    console.log('res', res);
  })
  .catch(err => {
    console.log('err', err);
  });

function svg2png(svg: string) {
  return new Promise((resolve, reject) => {
    svg2img(svg, { width: 800 }, (err, buffer) => {
      if (err === null) {
        resolve(buffer.toString('base64'));
      } else {
        reject(err);
      }
    });
  });
}
