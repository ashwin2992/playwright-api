function stringFormat(str, ...args) {
  return str.replace(/{(\d+)}/g, (match, index) => {
    const value = args[Number(index)];
    return value === undefined || value === null ? match : String(value);
  });
}

module.exports = {
  stringFormat
};
