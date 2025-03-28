const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema({
    shopname: {
        type: String,
        required: [true, "A shop must have a shopname"],
    },
    region: {
        type: String,
        required: [true, "A shop must have a region"]
    },
    address: {
        type: String,
        required: [true, "A shop must have an address"]
    },
    openingHour: {
        type: String,
        required: [true, "A shop must have an openingHour"]
    },
    lat: {
        type: String,
        required: [true, "A shop must have an lat"]
    },
    lng: {
        type: String,
        required: [true, "A shop must have a lag"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    comments: [String],
    shopImages: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;