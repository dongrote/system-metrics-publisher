'use strict';
exports = module.exports = async interfaces => {
  for (iface in interfaces) {
    const i = await iface.create();
    if (i) {
      return i;
    };
  }
  return null;
};
