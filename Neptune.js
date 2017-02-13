var TelegramBot = require('node-telegram-bot-api');
var schedule = require('node-schedule');

var token = '294923397:AAGupc3y6KcSztxk4hCc6SqUHI-LxowVv34';

var bot = new TelegramBot(token, { polling: true });

var texts = [
    'מים לדוד המלך!',
    'שתה יא זין!',
    'Drink motherfucker!',
    'השמפנייה של הטבע',
    'עצור הכל ולך לשתות',
    'מים',
    'זוהי תזכורת אישית במיוחד עבורך, לך לשתות',
    'אני יודע אתה עצלן ועוד לא שתית היום, אבל עכשיו זה הזמן הנכון',
    'Water!',
    'כובע על הראש, משקפיים לעיניים, לשבת בצל ולא לשכוח מים!',
    'גם סודה זה בסדר',
    'היום יום חם, נא לשבת בצל ולשתות הרבה מים!'
];

module.exports = {
    CreateTimer
}

function CreateTimer(){
    var rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(9, 21);

    rule.minute = 0;
    
    var j = schedule.scheduleJob(rule, function(){
        var timer = Math.floor(Math.random() * 100) % 60;
          
        var t = new Date();
        t.setMinutes(t.getMinutes() + timer);
        
        var inner = schedule.scheduleJob(t, function(){
        var text = texts[Math.floor((Math.random()*100))%texts.length];
            
            bot.sendMessage(20310797 , text);
        
            bot.sendMessage(100562769 , text);
        });
    });
}