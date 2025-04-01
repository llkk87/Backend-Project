const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router.route("/").get(productController.getAllProducts).post(authController.protect, authController.restrictTo("admin", "editor"), productController.createProduct)
router.route("/:id").get(productController.getProduct).patch(authController.protect, authController.restrictTo("admin", "editor"), productController.updateProduct).delete(authController.protect, authController.restrictTo("admin"), productController.deleteProduct)
router.route("/search/:keyword").get(productController.getProductsByKeyword)
// router.route("/search/:name").get(productController.getProdByName)
// router.route("/search/:name/:minprice/:maxprice").get(productController.getProdByNamePrice)

module.exports = router;
