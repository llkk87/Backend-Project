const express = require("express");
const app = express();

const shopRouter = require("./routes/shopRoutes");
const productRouter = require("./routes/productRoutes");

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/api/v1/shops", shopRouter);
// app.use("/api/v1/products", productRouter);


module.exports = app;