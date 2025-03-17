const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const products = data.products;

exports.getAllProducts = async (req, res) => {
  try {
    res.status(200).json({
      staus: "scccess",
      results: shops.length,
      data: {
        products
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log(id);
    const shop = products.find(el => el.id = id);

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

exports.createProduct = async (req, res) => {
  const newId = products[shops.length - 1].id + 1;
  const newProduct = Object.assign({id: newId}, req.body);
  data.shops.push(newProduct);
  console.log(data.products);

  fs.writeFile(`${__dirname}/../test-data.json`, JSON.stringify(data) , err => {
    res.status(201).json({
      status: "success",
      data: {
        shop: newProduct
      }
    });
  });
};

exports.updateProduct = (req, res) => { // http 200 OK
  res.status(200).json({
    status: "success",
    data: {
      shop: "<updated shop here>"
    }
  });
}; // not yet implememted

exports.deleteProduct = (req, res) => { // http 204 No Content
  res.status(204).json({
    status: "success",
    data: null
  });
}; // not yet implememted