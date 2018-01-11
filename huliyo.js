var TelegramBot = require('node-telegram-bot-api');

var token = '313967348:AAFhtcLAdHb3EdRlT4dCw1CtzhH7GEfx4lQ';
var bot = new TelegramBot(token, { polling: true });

bot.onText(/הוסף (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `הוספתי את ההודעה ${match[1]} לרשימת ההודעות`; 

    msgService.addNewText(match[1]);

    bot.sendMessage(chatId, resp);
});
