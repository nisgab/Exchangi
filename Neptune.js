var TelegramBot = require('node-telegram-bot-api');
var schedule = require('node-schedule');
var msgService = require('./msgservice.js');
var fs = require('fs');
var request = require('request');

var token = '294923397:AAGupc3y6KcSztxk4hCc6SqUHI-LxowVv34';

var bot = new TelegramBot(token, { polling: true });

module.exports = {
    CreateTimer
}

function CreateTimer(){

    msgService.refreshTextMessages();

    var rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(7, 19);

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

            subscribers.forEach(x => bot.sendPhoto(x, text));
        }
        else{
            subscribers.forEach(x => bot.sendMessage(x, text));
        }
        });
    });
}

var subscribers = [
    20310797, // Nissan
    100562769 // Bar
];

bot.onText(/הוסף (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = `הוספתי את ההודעה ${match[1]} לרשימת ההודעות`; 

    msgService.addNewText(match[1]);

    bot.sendMessage(chatId, resp);
});
