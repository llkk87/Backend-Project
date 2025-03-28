const Shop = require("../models/shopModel")

// Haversine forumla (dirtect distance of two points)
function haversineDistance(coords1, coords2, isMiles = false) {
  const toRad = (x) => x * Math.PI / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;

  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;

  if (isMiles) {
    distance /= 1.60934 // km to miles
  }

  return distance;
}

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();

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
    console.log("getShop", req.params.id)
    const shop = await Shop.findById(req.params.id);

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
    const keyword = req.params.keyword;
    const shop = await Shop.find({
      $or: [
        { shopname: { $regex: keyword, $options: "i" } }, // case-insensitive
        { region: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } }
      ]
    });

    res.status(200).json({
      status: "success",
      data: {
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

exports.getNearbyShops = async (req, res) => {
  try {
    const shops = await Shop.find();

    let coordsInput = { latitude: req.params.lat, longitude: req.params.lng };
    let coordsShop = { latitude: 34.0522, longitude: -118.2437 };

    let result = shops.filter((shop) => {
      coordsShop = { latitude: shop.lat, longitude: shop.lng };
      console.log("haversineDistance", haversineDistance(coordsInput, coordsShop));
      return haversineDistance(coordsInput, coordsShop) <= req.params.range; // return the result shoter than :range in km
    });

    if (result.length > 0) {
      res.status(200).json({
        status: "success",
        data: {
          shops: result
        }
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No Nearby Shop"
      });
    }

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
}

exports.createShop = async (req, res) => {
  try {
    const newShop = await Shop.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        shop: newShop
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.updateShop = async (req, res) => { // http 200 OK
  try {
    const shop = Shop.findByIdAndUpdate(req.params.id, res.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
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

exports.deleteShop = async (req, res) => { // http 204 No Content
  try {
    await Shop.findByIdAndDelete(req.params.id);

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