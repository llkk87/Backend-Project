const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const cors = require("cors");
app.use(cors());

const DB = "mongodb://localhost:27017/backend-project";

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(()=> {
    console.log("DB connection successful!");
})

const port = 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})