const express = require("express");
const app = express();

const shopRouter = require("./routes/shopRoutes");
const productRouter = require("./routes/productRoutes");
const questionRouter = require("./routes/questionRoutes")

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/api/shop", shopRouter);
app.use("/api/product", productRouter);
app.use("/api/question", questionRouter);


module.exports = app;