const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A product must have a name"],
    },
    brand: {
        type: String,
        required: [true, "A product must have a brand"]
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"]
    },
    category: {
        type: String,
        required: [true, "A product must have a category"]
    },
    description: {
        type: String
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
    productImages: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;