const fs = require("fs");
const mongoose = require("mongoose");
const Shop = require("./models/shopModel");
const Product = require("./models/productModel");
const Question = require("./models/questionModel")

const DB = "mongodb://localhost:27017/backend-project";

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => {
    console.log("DB connection successful!");
})

// READ JSON FILE
const data = JSON.parse(fs.readFileSync(`${__dirname}/test-data.json`, "utf-8"));
const shops = data.shops
const products = data.products
const questions = data.questions

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Shop.create(shops);
        await Product.create(products);
        await Question.create(questions);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err)
    }
    process.exit()
}


// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Shop.deleteMany();
        await Product.deleteMany();
        await Question.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err)
    }
    process.exit() 
}

// deleteData();
// importData();

console.log(process.argv);
if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] = "--delete") {
    deleteData();
}