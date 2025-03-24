const express = require("express");
const productController = require("./../controllers/productController");
const router = express.Router();

router.route("/").get(productController.getAllProducts).post(productController.createProduct)
router.route("/:id").get(productController.getProduct).patch(productController.updateProduct).delete(productController.deleteProduct)
// router.route("/search/:name").get(productController.getProdByName)
// router.route("/search/:name/:minprice/:maxprice").get(productController.getProdByNamePrice)

module.exports = router;
