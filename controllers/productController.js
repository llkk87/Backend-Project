const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const products = data.products;

exports.getAllProducts = async (req, res) => {
  try {
    res.status(200).json({
      staus: "success",
      results: products.length,
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
    console.log("getProduct", id);
    const product = products.find(el => el.id == id);

    res.status(200).json({
      status: "success",
      message: {
        product
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
  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body);
  data.products.push(newProduct);
  console.log(data.products);

  fs.writeFile(`${__dirname}/../test-data.json`, JSON.stringify(data), err => {
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct
      }
    });
  });
};

exports.updateProduct = async (req, res) => { // http 200 OK
  const id = Number(req.params.id);
  console.log("updateProduct", id);
  const product = products.find(el => el.id == id);

  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: ("product not found")
    });
  }

  const updates = req.body;
  for (let key in updates) {
    if (product[key] !== undefined) { // product.hasOwnProperty(key)
      product[key] = updates[key]
    }
  }
  console.log(products)

  res.status(200).json({
    status: "success",
    data: {
      product: product
    }
  });

}; // not yet written into test-data.json

exports.deleteProduct = async (req, res) => { // http 204 No Content
  const id = Number(req.params.id);
  console.log("deleteProduct", id);
  const index = products.findIndex(el => el.id == id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: ("product not found")
    });
  }

  products.splice(index, 1);
  console.log(products)

  res.status(204).json({
    status: "success",
    message: "product successfully deleted",
    data: null
  });
}; // not yet written into test-data.json

exports.getProdByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    console.log("getProdName", name);
    // const product = products.find(el => el.name == name);
    const product = products.filter(el => {
      return el.name.toLowerCase().includes(name);
    });

    res.status(200).json({
      status: "success",
      message: {
        product
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getProdByNamePrice = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const minPrice = Number(req.params.minprice);
    const maxPrice = Number(req.params.maxprice);

    console.log("getProdNamePrice", name, minPrice, maxPrice);
    const product = products.filter((el) => {
      return el.name.toLowerCase().includes(name) && minPrice <= el.price && maxPrice >= el.price; 
  });


    res.status(200).json({
      status: "success",
      message: {
        product
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};