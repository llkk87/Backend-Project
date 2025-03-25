const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const getData = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const { getJSON } = require("./../data");

console.log("Telegram Bot Server Start");
let token = "7449617212:AAHKzweWq1V2DekH1fWh_AiQaB1LI02w0AI";
let bot = new TelegramBot(token, { polling: true });


// Haversine forumla (dirtect distance of two points)
function haversineDistance(coords1, coords2, isMiles = false) {
    const toRad = (x) => x * Math.PI / 180;

    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;

    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    if (isMiles) {
        distance /= 1.60934 // km to miles
    }

    return distance;
}


function printoutShop(shop, bot, fromId, resp) {
    resp = shop.forEach((item) => {
        resp += `shopname: ${item.shopname}\n`;
        resp += `region: ${item.region}\n`;
        resp += `address: ${item.address}\n`;
        resp += `openingHour: ${item.openingHour}\n`;
        resp += `lat: ${item.lat}\n`;
        resp += `lng: ${item.lng}\n`;
        console.log("printoutShop:", resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

function printoutProduct(products, bot, fromId, resp) {
    resp = products.forEach((item) => {
        resp += `name: ${item.name}\n`;
        resp += `brand: ${item.brand}\n`;
        resp += `price: ${item.price}\n`;
        resp += `description: ${item.description}\n`;
        resp += `category: ${item.category}\n`;
        console.log("printoutProducts:", resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

function printoutQuestion(questions, bot, fromId, resp) {
    resp = questions.forEach((item) => {
        resp += `question: ${item.question}\n`;
        resp += `answer: ${item.answer}\n`;
        console.log("printoutQuestions:", resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

bot.onText(/\/start/, function (msg) {
    let chatId = msg.chat.id;
    let resp = "Welcome to my telegram bot";

    bot.sendMessage(chatId, resp);
});

// bot.onText(/\/shop/, function (msg) {
//     let fromId = msg.from.id;
//     let resp = "";
//     try {
//         printoutShop(shopData, bot, fromId, resp);
//     } catch (err) {
//         console.log("/shop onText error:", err)
//     }=>
// });

bot.onText(/\/product (.+)/, async function (msg, match) {
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    console.log("search input:", input)

    let getProductsByKeyword = await getJSON(`http://localhost:8000/api/products/search/${input}`);
    let productsData = getProductsByKeyword.data.data.products;
    console.log(productsData);

    printoutProduct(productsData, bot, fromId, resp);
});

bot.onText(/\/productprice (.+)/, async function (msg, match) {
    console.log("match:", match);
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    let parts = input.trim().split(/\s+/);
    let keyword = parts.slice(0, -2).join(" ");
    let minPrice = parts[parts.length - 2];
    let maxPrice = parts[parts.length - 1];

    let getAllProducts = await getJSON(`http://localhost:8000/api/products?keyword=${keyword}&price[gte]=${minPrice}&price[lte]=${maxPrice}`);
    let productData = getAllProducts.data.data.products;

    // if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
    //     return null;
    // }
    printoutProduct(productData, bot, fromId, resp);
});


bot.onText(/\/question (.+)?/, async function (msg, match) {
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    console.log("question input:", input);

    let getQuestionsByKeyword = await getJSON(`http://localhost:8000/api/questions/search/${input}`);
    let questionData = getQuestionsByKeyword.data.data.questions
    console.log("questionData:", questionData);

    printoutQuestion(questionData, bot, fromId, resp);
});

bot.on('location', async (msg) => {
    try {
        let fromId = msg.from.id;
        let resp = "";

        let getNearbyShops = await getJSON(`http://localhost:8000/api/shops/locate/${msg.location.latitude}/${msg.location.longitude}/0.2`);

         getNearbyShops.data.data != undefined ? printoutShop(getNearbyShops.data.data.shops, bot, fromId, resp) :  bot.sendMessage(fromId, getNearbyShops.data.message);

    } catch (err) {
        console.log("get location error:", err);
    }
});
