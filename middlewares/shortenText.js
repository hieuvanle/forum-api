const shortenText = (string) => {
  return string.length > 30 ? string.substring(0, 50) + "..." : string;
};

module.exports = shortenText;
