const express = require("express");
const shopController = require("../controllers/shopController.js");
const router = express.Router();

// router.param('id', tourController.);

router.route("/").get(shopController.getAllShops).post(shopController.createShop)
router.route("/:id").get(shopController.getShop).patch(shopController.updateShop).delete(shopController.deleteShop)
router.route("/search/:keyword").get(shopController.getShopByKeyword)
router.route("/locate/:lat/:lng/:range").get(shopController.getNearbyShops)


module.exports = router;
