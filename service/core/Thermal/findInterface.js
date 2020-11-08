'use strict';
exports = module.exports = async interfaces => {
  for (interface in interfaces) {
    const i = await interface.create();
    if (i) {
      return i;
    };
  }
  return null;
};
