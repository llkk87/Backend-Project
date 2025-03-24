const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const shops = data.shops;

exports.getAllShops = async (req, res) => {
  try {
    res.status(200).json({
      staus: "success",
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
    console.log("getShop:", id);
    const shop = shops.find(el => el.id == id);

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

exports.getShopByKeyword = async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();
    console.log("getShopbyKeyword:", keyword);
    const shop = shops.filter((el) => {
      return el.shopname.toLowerCase().includes(keyword) || el.region.toLowerCase().includes(keyword) || el.address.toLowerCase().includes(keyword);
  });

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
  const newShop = Object.assign({ id: newId }, req.body);
  data.shops.push(newShop);
  console.log(data.shops);

  fs.writeFile(`${__dirname}/../test-data.json`, JSON.stringify(data), err => {
    res.status(201).json({
      status: "success",
      data: {
        shop: newShop
      }
    });
  });
};

exports.updateShop = async (req, res) => { // http 200 OK
  const id = Number(req.params.id);
  console.log("updateShop", id);
  const shop = shops.find(el => el.id == id);

  if (!shop) {
    return res.status(404).json({
      status: "fail",
      message: ("shop not found")
    });
  }

  const updates = req.body;
  for (let key in updates) {
    if (shop[key] !== undefined) { // shop.hasOwnProperty(key)
      shop[key] = updates[key]
    }
  }
  console.log(shops)

  res.status(200).json({
    status: "success",
    data: {
      shop: shop
    }
  });

}; // not yet written into test-data.json

exports.deleteShop = async (req, res) => { // http 204 No Content
  const id = Number(req.params.id);
  console.log("deleteShop", id);
  const index = shops.findIndex(el => el.id == id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: ("shop not found")
    });
  }

  shops.splice(index, 1);
  console.log(shops)

  res.status(204).json({
    status: "success",
    message: "shop successfully deleted",
    data: null
  });
}; // not yet written into test-data.json