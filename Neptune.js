var TelegramBot = require('node-telegram-bot-api');
var schedule = require('node-schedule');
var msgService = require('./msgservice.js');

var token = '294923397:AAGupc3y6KcSztxk4hCc6SqUHI-LxowVv34';

var bot = new TelegramBot(token, { polling: true });

module.exports = {
    CreateTimer
}

function CreateTimer(){

    msgService.refreshTextMessages();
    msgService.refreshSubscribers();

    var rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(6, 18);

    rule.minute = 0;
    
    var j = schedule.scheduleJob(rule, function(){
        var timer = Math.floor(Math.random() * 100) % 60;
        //var timer = 0;
          
        var t = new Date();
        t.setMinutes(t.getMinutes() + timer);
        
        var inner = schedule.scheduleJob(t, function(){
        

    var allTexts = msgService.getTexts();

        var text = allTexts[Math.floor((Math.random()*100))%allTexts.length];
            
        if (text.includes('http:')){

            msgService.getSubscribers().forEach(x => bot.sendPhoto(x.chatID, text));
        }
        else{
            msgService.getSubscribers().forEach(x => bot.sendMessage(x.chatID, text));
        }

        
        });
    });
}

bot.onText(/הוסף (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `הוספתי את ההודעה ${match[1]} לרשימת ההודעות`; 

    msgService.addNewText(match[1]);

    bot.sendMessage(chatId, resp);
});

bot.onText(/התחל/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `ברוך הבא, בקרוב אתחיל להזכיר לך לשתות, זה חשוב, אל תזלזל!`; 

    msgService.addSubscriber(msg.chat.id, msg.from.first_name, msg.from.last_name);

bot.sendMessage(20310797 , `${msg.from.first_name + " " + msg.from.last_name} joined`);
    bot.sendMessage(chatId, resp);
});

bot.onText(/הפסק/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `אני אפסיק לנדנד לך עכשיו, אתה יכול להתחיל לקבל הודעות מחדש על ידי שליחה של "התחל"`; 

    msgService.removeSubscriber(msg.chat.id);

    bot.sendMessage(chatId, resp);
});

bot.onText(/refresh/i, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `Refreshing text db`; 

    msgService.refreshTextMessages();

    bot.sendMessage(chatId, resp);
});

bot.onText(/getalltexts/i, (msg, match) => {
  
    const chatId = msg.chat.id;
    var allTexts = msgService.getTexts();

    msgService.refreshTextMessages();

    bot.sendMessage(chatId, allTexts);
});