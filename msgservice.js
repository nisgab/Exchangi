const rp = require("request-promise");

var texts = [];
var subscribers = [];

module.exports = {
    addNewText,
    getTexts,
    refreshTextMessages,
    refreshSubscribers,
    getSubscribers,
    addSubscriber,
   removeSubscriber
}

function refreshTextMessages(){
    texts.length = 0;

    var options = {
        method: 'GET',
        url: 'https://neptune-cbba.restdb.io/rest/neptune-text',
        headers: 
        {   'cache-control': 'no-cache',
            'x-apikey': 'b2d374b1b4eb3d3651ad13267554617083cec' 
        } 
    };

    rp(options)
        .then(res => {
            var jObj = JSON.parse(res);

            jObj.forEach(x => {
                texts.push(x.text);
            })
        });
}

function addNewText(newText){
    var options = { 
        method: 'POST',
        url: 'https://neptune-cbba.restdb.io/rest/neptune-text',
        headers: 
        {   'cache-control': 'no-cache',
            'x-apikey': 'b2d374b1b4eb3d3651ad13267554617083cec', 
            'content-type': 'application/json' },
        body: { text : newText },
        json: true 
    };

    rp(options);

    texts.push(newText);
}

function refreshSubscribers(){
    subscribers.length = 0;

    var options = {
        method: 'GET',
        url: 'https://neptune-cbba.restdb.io/rest/subscribers',
        headers: 
        {   'cache-control': 'no-cache',
            'x-apikey': 'b2d374b1b4eb3d3651ad13267554617083cec' 
        } 
    };

    rp(options)
        .then(res => {
            var jObj = JSON.parse(res);

            jObj.forEach(x => {
                subscribers.push(x);
            })
        });
}


function addSubscriber(chatID, firstName, lastName){
    var bodyObj = {};
    bodyObj.chatID = chatID;
    bodyObj.firstName = firstName;
    bodyObj.lastName = lastName;

    
    var options = { 
        method: 'POST',
        url: 'https://neptune-cbba.restdb.io/rest/subscribers',
        headers: 
        {   'cache-control': 'no-cache',
            'x-apikey': 'b2d374b1b4eb3d3651ad13267554617083cec', 
            'content-type': 'application/json' },
        body: bodyObj,
        json: true 
    };

    rp(options)
    .then(()=> refreshSubscribers());
}

function removeSubscriber(chatID){

    var recordID = isRecordSubscribed(chatID);

    if (recordID){
        var options = { 
            method: 'DELETE',
            url: `https://neptune-cbba.restdb.io/rest/subscribers/${recordID}`,
            headers: 
            {   'cache-control': 'no-cache',
                'x-apikey': 'b2d374b1b4eb3d3651ad13267554617083cec', 
                'content-type': 'application/json' },
            json: true 
        };

        rp(options)
            .then(()=> refreshSubscribers());

        var subIndex = subscribers.indexOf(x => x.chatID === chatID);

        if (subIndex != -1){
            subscribers.splice(subIndex, 1);
        }        
    }
}

function isRecordSubscribed(chatID){
     var recordID = undefined;
     subscribers.forEach(sub => {
        if (sub.chatID === chatID){
            recordID = sub._id;   
        }
    });

    return recordID;
}

function getSubscribers(){
    return subscribers;
}
function getTexts(){
    return texts;   
}