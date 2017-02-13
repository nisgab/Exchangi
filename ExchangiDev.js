var TelegramBot = require('node-telegram-bot-api');
var rp = require('request-promise');
var schedule = require('node-schedule');
var jsonfile = require('jsonfile');
var neptune = require('./neptune.js');

neptune.CreateTimer();

var token = '350677624:AAEawDrTMsOSvPidgTv24M-nGBBCts0dbuE';

const shekel = "שקל";
const cm = "סמ";
const km = "קמ";
const kilo = "קילו";
const mileToKM = 1 / 1.60934;
const intchToCM = 0.393701;
const pountToKilo = 1/0.453592;

const simpleExchangeRegex = /([0-9]*\.[0-9]+|[0-9]+)\s+([\u0590-\u05FF]+)/;
const startCommand = /\/start/;

var rateDictionary = {};
var userLogs = {};

updateRates();

function updateRates(){
    rp ('http://api.fixer.io/latest?base=ILS')
        .then(res => {
            var rates = JSON.parse(res).rates;
            buildDictionary(rates);
            jsonfile.writeFileSync("rates.json", rateDictionary);        
        });
}

function buildDictionary(rates){
    for (var member in rateDictionary) delete rateDictionary[member];

    rateDictionary["דולר"] = getRateObj(rates.USD, shekel);
    rateDictionary["דולר קנדי"] = getRateObj(rates.CAD, shekel);
    rateDictionary["קנדי"] = getRateObj(rates.CAD, shekel);
    rateDictionary["דולר אוסטרלי"] = getRateObj(rates.AUD, shekel);
    rateDictionary["אוסטרלי"] = getRateObj(rates.AUD, shekel);
    rateDictionary["רופי"] = getRateObj(rates.INR, shekel);
    rateDictionary["יורו"] = getRateObj(rates.EUR, shekel);
    rateDictionary["פורינט"] = getRateObj(rates.HUF, shekel);
    rateDictionary["זלוטי"] = getRateObj(rates.PLN, shekel);
    rateDictionary["שקל"] = getRateObj(1, shekel);
    rateDictionary["רובל"] = getRateObj(rates.RUB, shekel);
    rateDictionary["ין"] = getRateObj(rates.JPY, shekel);
    rateDictionary["יאן"] = getRateObj(rates.JPY, shekel);
    rateDictionary["לירה שטרלינג"] = getRateObj(rates.GBP, shekel);
    rateDictionary["לירה"] = getRateObj(rates.GBP, shekel);
    rateDictionary["לישט"] = getRateObj(rates.GBP, shekel);
    rateDictionary["ליסט"] = getRateObj(rates.GBP, shekel);
    rateDictionary["אינטש"] = getRateObj(intchToCM, cm);
    rateDictionary["אינץ"] = getRateObj(intchToCM, cm);
    rateDictionary["מייל"] = getRateObj(mileToKM, km);
    rateDictionary["פאונד"] = getRateObj(pountToKilo, kilo);
}

function getRateObj(rate, postfix){
    var res = {};
    res["rate"] = rate;
    res["postfix"] = postfix;
    return res;
}

var rule = new schedule.RecurrenceRule();
 rule.minute =59;
 
schedule.scheduleJob(rule, function(){
   updateRates();

    var logMessage = "";

    for (var member in userLogs){
        console.log(userLogs[member]);
        logMessage = logMessage + `${userLogs[member].firstName} ${userLogs[member].lastName} ${userLogs[member].count} \n`;
    };

    if (logMessage !== ""){
        bot.sendMessage(20310797 , logMessage);
    }

    for (var member in userLogs) delete userLogs[member];
});

var bot = new TelegramBot(token, { polling: true });

bot.on('text', function (msg) {
     var chatId = msg.chat.id;

     var userData = userLogs[chatId];

     if (!userData){
         userData = {};
         userData.firstName = msg.from.first_name;
         userData.lastName = msg.from.last_name;
         userData.count = 0;
     }

    if (simpleExchangeRegex.test(msg.text)){
        var match = simpleExchangeRegex.exec(msg.text);
        handleSimpleExchange(msg, match);
    }
    else if(startCommand.test(msg.text)){
        handleStartCommand(msg);
    }
    else {
        bot.sendMessage(20310797 , `Got new undefiend text '${msg.text}'`);
        bot.sendMessage(chatId, "כרגע אני לא יודע מה לעשות עם זה, אני אשתפר בהמשך, מבטיח :)");
    }
    
    userData.count = userData.count + 1;
    userLogs[chatId] = userData;
});

function handleStartCommand(msg){    
    var resp = "שלום לך!" + "\n" + 
        "אני פה כדי לעזור לך להמיר מטבעות, אינטצים, מידות אמריקאיות מוזרות ועוד פשוט שלחו אלי מה וכמה ואני אשתדל לעשות את ההמרה עבורכם" + "\n" +
        "לדוגמא '50 דולר' או '10 אינץ' או '15 פאונד' ועוד ועוד"
    bot.sendMessage(msg.chat.id, resp);
};


function handleSimpleExchange(msg, match){

    var rate = rateDictionary[match[2]];

    if (rate){
        sendMessage(msg.chat.id, match[1], rate.rate, rate.postfix);
    }
    else{
            bot.sendMessage(msg.chat.id, "סורי, לא הבנתי את זה, אני אשתדל ללמוד להבא");
            bot.sendMessage(20310797 , `Got new prase '${match[2]}'`);
    }
};

function sendMessage(chatId, amount, rate, desc){
    var resp = (amount / rate).toFixed(3) + " " + desc;
    bot.sendMessage(chatId, resp);
}
