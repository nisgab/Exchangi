var TelegramBot = require('node-telegram-bot-api');
var rp = require('request-promise');
var schedule = require('node-schedule');

var token = '323882318:AAHBLbKiTKTfBY-tG0RkiJldYufiucKROWE';

var rates = {};

rp ('http://api.fixer.io/latest?base=ILS&symbols=USD,EUR,ILS')
    .then(res => {
        rates = JSON.parse(res).rates;
        
    });

// var rule = new schedule.RecurrenceRule();
// rule.minute = 1;
 
// schedule.scheduleJob(rule, function(){
    
// rp ('http://api.fixer.io/latest?base=ILS&symbols=USD,EUR,ILS')
//     .then(res => {
//         rates = JSON.parse(res);
//     });
// });

var bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, function (msg, match) {
    
    var resp = "שלום לך!" + "\n" + 
        "אני פה כדי לעזור לך להמיר מטבעות, פשוט שלחו אלי מה הסכום המבוקש להמרה ולאיזה מטבע ואני אומר לכם כמה הוא יוצא בשקלים" + "\n" +
        "לדוגמא '50 דולר'"
    bot.sendMessage(msg.chat.id, resp);
});


bot.onText(/(\d+)\s+([\u0590-\u05FF]+)/, function (msg, match) {
    var rate = 1;

    if(match[2] === "דולר")
        rate = rates.USD;
    else if(match[2] === "יורו")
        rate = rates.EUR;
    else {
        bot.sendMessage(msg.chat.id, "אני לא מכיר את המטבע הזה, סורי");
        return;    
    }
        
    sendExchange(msg.chat.id, match[1], rate);
});

function sendExchange(chatId, amount, rate){    
    var resp = amount / rate + " שקל";
    bot.sendMessage(chatId, resp);
}