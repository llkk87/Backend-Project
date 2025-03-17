const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const shops = data.shops;

exports.getAllShops = (req, res) => {
  res.status(200).json({
    staus: "scccess",
    results: shops.length,
    data: {
      shops,
    },
  });
};
