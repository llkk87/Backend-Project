const Product = require("./../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    // console.log("req.query:", req.query); // ?price[gte]=50
    // BUILD QUERY

    console.log(req.query);
    let query;
    if (Object.keys(req.query).length != 0) { // cheeck if object is empty
      // ** Filtering **
      const queryObj = { ...req.query } // directly assign req.query is just assign a reference not the object itself
      const exculdedFields = ["page", "sort", "limit", "fields"];
      exculdedFields.forEach(el => delete queryObj[el]);

      // ** Advanced filtering **
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // \b \b is exact same word. Without /g only replace the first one
      let queryObj2 = JSON.parse(queryStr);
      console.log("query after adding $ for mongogb:", queryObj2);

      // mongodb : { name: "ssd", price: {$gte: 50} }
      // url input ?price[gte]=5 : { name: "ssd", duration: {gte: '50'} }
      // gte, gt, lte, lt

      // if directly put object method in here, the "await" would make it not working. Solution is move the await to other var
      // const query = Product.find(JSON.parse(queryStr));

      let keyword = queryObj2.keyword;

      query = Product.find({
        $and: [
          {
            $or: [
              { name: { $regex: keyword, $options: "i" } }, // case-insentive
              { brand: { $regex: keyword, $options: "i" } },
              { description: { $regex: keyword, $options: "i" } },
              { category: { $regex: keyword, $options: "i" } }
            ]
          },
          { price: queryObj2.price }
        ]
      });
    } else {
      query = Product.find();
    }


    // ** Field limiting **
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v")  // everything except __v
    }

    // EXCUTE QUERY
    const products = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
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
    const products = await Product.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        products
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getProductsByKeyword = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // case-insensitive
        { brand: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } }
      ]
    });

    res.status(200).json({
      status: "success",
      data: {
        products
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
  try {
    // const newProduct  = new Product({});
    // newProduct .save();

    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        products: newProduct
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.updateProduct = async (req, res) => {
  try { // findByIdAndUpdate works for PATCH but not POST 
    const products = await Product.findByIdAndUpdate(req.params.id, req.body, { // pls read the documentation. runValidators check price is number not string
      new: true,
      runValidators: true
    });

    res.status(200).json({ // before es6 product: product, es6 product
      status: "success", // http 200 OK
      data: {
        products
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.deleteProduct = async (req, res) => { // http 204 No Content
  await Product.findByIdAndDelete(req.params.id);

  try {
    res.status(204).json({
      status: "success",
      data: "null"
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

// exports.getProdByName = async (req, res) => {
//   try {
//     const product = await Product.findOne({name: req.params.name});

//     res.status(200).json({
//       status: "success",
//       message: {
//         product
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

// exports.getProdByNamePrice = async (req, res) => {
//   try {
//     const name = req.params.name.toLowerCase();
//     const minPrice = Number(req.params.minprice);
//     const maxPrice = Number(req.params.maxprice);

//     console.log("getProdNamePrice", name, minPrice, maxPrice);
//     const product = products.filter((el) => {
//       return el.name.toLowerCase().includes(name) && minPrice <= el.price && maxPrice >= el.price;
//     });


//     res.status(200).json({
//       status: "success",
//       message: {
//         product
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };