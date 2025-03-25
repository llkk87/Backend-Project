const { getJSON } = require("./../data");

let getAllShops = getJSON(`http://localhost:8000/api/shops`);
console.log(getAllShops)