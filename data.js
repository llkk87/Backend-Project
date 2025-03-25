const fs = require("fs").promises;
const axios = require("axios");

exports.readJSONfile = async function(datapath) {
    return await fs.readFile(datapath, "utf-8");
}

exports.writeJSONfile = async function (datapath, data) {
    return await fs.writeFile(datapath, "utf-8");
}

exports.getJSON = async function (url) {
    return await axios.get(url);
}