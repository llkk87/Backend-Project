const express = require("express");
const shopController = require("./../controllers/shopController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router();

// router.param('id', tourController.);

router.route("/").get(shopController.getAllShops).post(authController.protect, authController.restrictTo("admin", "editor"), shopController.createShop)
router.route("/:id").get(shopController.getShop).patch(authController.protect, authController.restrictTo("admin", "editor"), shopController.updateShop).delete(authController.protect, authController.restrictTo("admin"), shopController.deleteShop)
router.route("/search/:keyword").get(shopController.getShopByKeyword)
router.route("/locate/:lat/:lng/:range").get(shopController.getNearbyShops)


module.exports = router;
