const TelegramBot = require("node-telegram-bot-api");
// const getData = require("./../fetch-data.js");
const fs = require("fs");
const getData = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));

let shopData = getData.shops;
let productData = getData.products;
let questionData = getData.questions;


console.log("Telegram Bot Server Start");
let token = "7449617212:AAHKzweWq1V2DekH1fWh_AiQaB1LI02w0AI";
let bot = new TelegramBot(token, { polling: true });

// function printoutShop(shop, bot, fromId, resp) {
//     resp = shop.forEach((item) => {
//         resp += `shopname: ${item.shopname}\n`;
//         resp += `region: ${item.region}\n`;
//         resp += `address: ${item.address}\n`;
//         resp += `openingHour: ${item.openingHour}\n`;
//         resp += `lat: ${item.lat}\n`;
//         resp += `lng: ${item.lng}\n`;
//         console.log("printoutShop:", resp);
//         bot.sendMessage(fromId, resp);
//         resp = "";
//     });
// }

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
    let result = productData.filter((product) => {
        return product.name.toLowerCase().includes(input);
    });
    console.log("result:", result);
    printoutProduct(result, bot, fromId, resp);
});

bot.onText(/\/question (.+)/, function (msg, match) {
    console.log("match:", match);
    let fromId = msg.from.id;
    let resp = "";
    let input = match[1].toLowerCase();
    let result = questionData.filter((question) => {
        return question.question.toLowerCase().includes(input) || question.answer.toLowerCase().includes(input);
    });
    console.log("result:", result);
    printoutQuestion(result, bot, fromId, resp);
});
