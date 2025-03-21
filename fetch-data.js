const axios = require("axios");
const url = "./test-data.json";

exports.getData = axios.get(url);
