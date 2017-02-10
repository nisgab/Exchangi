var TelegramBot = require('node-telegram-bot-api');
var rp = require('request-promise');
var schedule = require('node-schedule');

var token = '350677624:AAEawDrTMsOSvPidgTv24M-nGBBCts0dbuE';

const shekel = "שקל";
const cm = "סמ";
const km = "קמ";
const kilo = "קילו";
const mileToKM = 1 / 1.60934;
const intchToCM = 0.393701;
const pountToKilo = 1/0.453592;

var rates = {};
updateRates();

function updateRates(){
    rp ('http://api.fixer.io/latest?base=ILS')
        .then(res => {
            rates = JSON.parse(res).rates;
            
        });
}

var rule = new schedule.RecurrenceRule();
 rule.minute = 59;
 
schedule.scheduleJob(rule, function(){
    console.log("entered");
   updateRates();
});

var bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, function (msg, match) {
    
    var resp = "שלום לך!" + "\n" + 
        "אני פה כדי לעזור לך להמיר מטבעות, אינטצים, מידות אמריקאיות מוזרות ועוד פשוט שלחו אלי מה וכמה ואני אשתדל לעשות את ההמרה עבורכם" + "\n" +
        "לדוגמא '50 דולר' או '10 אינץ' או '15 פאונד' ועוד ועוד"
    bot.sendMessage(msg.chat.id, resp);
});


bot.onText(/(\d+)\s+([\u0590-\u05FF]+)/, function (msg, match) {
    var rate = 1;

    switch (match[2]){
        case "דולר":{
            sendMessage(msg.chat.id, match[1], rates.USD, shekel);
            break;
        }
        case "יורו":{
            sendMessage(msg.chat.id, match[1], rates.EUR, shekel);
            break;
        }
        case "פורינט" :{
            sendMessage(msg.chat.id, match[1], rates.HUF, shekel);
            break;
        }
        case "זלוטי" :{
            sendMessage(msg.chat.id, match[1], rates.PLN, shekel);
            break;
        }
        case "שקל" :{
            sendMessage(msg.chat.id, match[1], 1, shekel);
            break;
        }
        case "אינטש":
        case "אינץ" : {
            sendMessage(msg.chat.id, match[1], intchToCM, cm);
            break;
        }
        case "מייל" :{
            sendMessage(msg.chat.id, match[1], mileToKM, km);
            break;
        }
        case "פאונד" :{
            sendMessage(msg.chat.id, match[1], pountToKilo, kilo);
            break;
        }
        default : {
            bot.sendMessage(msg.chat.id, "סורי, לא הבנתי את זה, אני אשתדל ללמוד להבא");
            bot.sendMessage(20310797 , `Got new prase '${match[2]}'`);
            break;
        }
    }
});

function sendMessage(chatId, amount, rate, desc){
    var resp = (amount / rate).toFixed(3) + " " + desc;
    bot.sendMessage(chatId, resp);
}
