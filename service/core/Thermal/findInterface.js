'use strict';
const interfaces = require('./interfaces');
exports = module.exports = async () => {
  for (const name in interfaces) {
    console.dir(interfaces[name]);
    const i = await interfaces[name].create();
    if (i) {
      return i;
    };
  }
  return null;
};
