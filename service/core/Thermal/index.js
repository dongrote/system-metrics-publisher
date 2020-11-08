'use strict';
exports = module.exports = {};
const fs = require('fs'),
  path = require('path');

fs.readdirSync(__dirname)
  .filter(fname => {
    console.log(`fname: ${fname}`);
    console.log(`__filename: ${__filename}`);
    return fname !== path.basename(__filename);
  })
  .map(fname => path.basename(fname, '.js'))
  .forEach(fname => {
    exports[fname] = require(`./${fname}`);
  });
