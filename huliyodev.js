// var TelegramBot = require('node-telegram-bot-api');
// var https = require('https');
// var zlib = require('zlib');
// const rp = require("request-promise");
// const fs = require("fs");

// var token = '328808129:AAFc33KN5e4Fo_S6-viT-uOv3TUShCOldEY';
// var bot = new TelegramBot(token, { polling: true });

// var Destinations = [];
// var Searches = [];
// var ValidDestinations = [];

// function refreshFlightsCache(){
//     Destinations.length = 0;

//     var headers = {
//         'Accept-Encoding':'gzip, deflate, sdch, br',
//         'Accept-Language' : 'en-US,en;q=0.8'
//     }

//     var options = {
//         gzip:true,
//         method: 'GET',
//         url: 'https://s3.eu-central-1.amazonaws.com/catalogs.hulyo.co.il/catalogs/Production/Flights/v1.4/above199Flights.js',
//         headers : {
//             'Accept-Encoding':'gzip, deflate, sdch, br',
//             'Accept-Language' : 'en-US,en;q=0.8',
//             'Accept': 'application/json'
//         }
        
//     };

//     rp(options)
//         .then(res => {
//             var jObj = JSON.parse(res);

//             jObj.Flights.map(x => {
//                 var r = {};

//                 r.destinationName = x.DealDestinationName;
//                 r.price = x.SalePrice;
//                 r.datesText = x.FlightsDatesText;
//                 r.availableSeats = x.AvailableSeats;

//                 return r;
//             })
//             .forEach(y => {
//                 Destinations.push(y);
//             });
//         });
// }

// function getValidDestinations(){
    
//     var options = {
//         gzip:true,
//         method: 'POST',
//         url: 'https://www.hulyo.co.il/web/HulyoSiteApi.svc/GetAllDestinations',
//     };

//     rp(options)
//     .then(res => {
//         var jObj = JSON.parse(res);

//         jObj.forEach(d => {
//             ValidDestinations.push(d.DestinationNameHeb);
//         })
//     });
    
// }

// function searchFlights(){
//     Searches.forEach(s => {
//         var res = Destinations.filter(d => d.destinationName === s.destination && d.price < s.maxPrice && d.availableSeats > 0);
        
//         if (res.length > 0){
//             var resp = "מצאתי התאמה! ";
            
//             res.forEach(r => {
//                 resp = resp + `${s.destination} ב${r.price} (${r.datesText})`
//             });

//             bot.sendMessage(s.user, resp);
//         }
//     });
// }

// function refreshQueries(){
//     Searches.length = 0;

//     var options = {
//         method: 'GET',
//         url: 'https://huliyobot-c4dd.restdb.io/rest/flight-queries',
//         headers: 
//         {   'cache-control': 'no-cache',
//             'x-apikey': '4fc88a169c81465390c975366305360c4466c' 
//         } 
//     };

//     return rp(options)
//         .then(res => {
//             var jObj = JSON.parse(res);

//             jObj.forEach(x => Searches.push(x));
//         });
// }

// bot.onText(/חפש (.+) עד (.*)/, (msg, match) => {

//     var searchObj = {};
//     searchObj.destination = match[1];
//     searchObj.user = msg.chat.id;
//     searchObj.userName = `${msg.from.first_name} ${msg.from.last_name}`;
//     searchObj.maxPrice = parseInt(match[2]);

//     if (ValidDestinations.filter(vd => vd === match[1]).length ===0){
//         bot.sendMessage(msg.chat.id, `סורי אני לא מכיר את היעד ${match[1]} אנא נסה משהו אחר`);
//     }
//     else {
//         var options = { 
//                 method: 'POST',
//                 url: 'https://huliyobot-c4dd.restdb.io/rest/flight-queries',
//                 headers: 
//                 {   'cache-control': 'no-cache',
//                     'x-apikey': '4fc88a169c81465390c975366305360c4466c', 
//                     'content-type': 'application/json' },
//                 body: searchObj,
//                 json: true 
//             };

//         rp(options)
//         .then(() => {
//             Searches.push(searchObj);

//             const chatId = msg.chat.id;
//             const resp = `אני אתחיל לחפש טיסות ל${match[1]} עד ${match[2]}`; 

//             bot.sendMessage(chatId, resp);
//         });
//     }
// });

// getValidDestinations();

// // refreshFlightsCache();
// // refreshQueries();

// // setTimeout(function() {
// //     searchFlights();
// // }, 20000);