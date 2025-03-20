const mongoose = require("mongoose");
const app = require("./app");

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