const express = require("express");
const app = express();

const shopRouter = require("./routes/shopRoutes");
const productRouter = require("./routes/productRoutes");
const questionRouter = require("./routes/questionRoutes")

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/api/shops", shopRouter);
app.use("/api/products", productRouter);
app.use("/api/questions", questionRouter);


module.exports = app;