const TelegramBot = require("node-telegram-bot-api");
// const getData = require("./../fetch-data.js");
const fs = require("fs");
const getData = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));

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

let shopData = getData.shops;
let productData = getData.products;
let questionData = getData.questions;


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

bot.onText(/\/search (.+)/, function (msg, match) {
    console.log("match:", match);
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    let result = productData.filter((el) => {
        return el.name.toLowerCase().includes(input);
    });
    console.log("result:", result);
    printoutProduct(result, bot, fromId, resp);
});

bot.onText(/\/searhprice (.+)/, function (msg, match) {
    console.log("match:", match);
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    let parts = input.trim().split(/\s+/);
    let keyword = parts.slice(0, -2).join(" ");
    let minPrice = parts[parts.length - 2];
    let maxPrice = parts[parts.length - 1];

    // if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
    //     return null;
    // }

    let result = productData.filter((el) => {
        return el.name.toLowerCase().includes(keyword) && minPrice <= el.price && maxPrice >= el.price; 
    });
    console.log("result:", result);
    printoutProduct(result, bot, fromId, resp);
});


bot.onText(/\/question (.+)?/, function (msg, match) {
    console.log("match:", match);
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1] ? match[1].toLowerCase() : "";
    let result;

    if (input === "") {
        result = questionData;
    } else {
        result = questionData.filter((question) => {
            return question.question.toLowerCase().includes(input) || question.answer.toLowerCase().includes(input);
        });
    }

    console.log("result:", result);
    printoutQuestion(result, bot, fromId, resp);
}); // not working yet

bot.on('location', async (msg) => {
    try {
        let fromId = msg.from.id;
        let resp = "";
        const coords1 = { latitude: msg.location.latitude, longitude: msg.location.longitude };
        let coords2 = { latitude: 34.0522, longitude: -118.2437 };

        let result = shopData.filter((shop) => {
            coords2 = { latitude: shop.lat, longitude: shop.lng }; // beware uppercase
            console.log("haversineDistance", haversineDistance(coords1, coords2));
            return haversineDistance(coords1, coords2) <= 2; // return the result shoter than 2km
        });

        if (result.length > 0) {
            printoutShop(result, bot, fromId, resp);
        } else {
            bot.sendMessage(fromId, "No nearby shop");
        }

    } catch (err) {
        console.log("get location error:", err);
    }
});
