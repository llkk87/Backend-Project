const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const shops = data.shops;

exports.getAllShops = async (req, res) => {
  try {
    res.status(200).json({
      staus: "scccess",
      results: shops.length,
      data: {
        shops
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getShop = async (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log(id);
    const shop = shops.find(el => el.id = id);

    res.status(200).json({
      status: "success",
      message: {
        shop
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.createShop = async (req, res) => {
  const newId = shops[shops.length - 1].id + 1;
  const newShop = Object.assign({id: newId}, req.body);
  data.shops.push(newShop);
  console.log(data.shops);

  fs.writeFile(`${__dirname}/../test-data.json`, JSON.stringify(data) , err => {
    res.status(201).json({
      status: "success",
      data: {
        shop: newShop
      }
    });
  });
};

exports.updateShop = (req, res) => { // http 200 OK
  res.status(200).json({
    status: "success",
    data: {
      shop: "<updated shop here>"
    }
  });
}; // not yet implememted

exports.deleteShop = (req, res) => { // http 204 No Content
  res.status(204).json({
    status: "success",
    data: null
  });
}; // not yet implememted