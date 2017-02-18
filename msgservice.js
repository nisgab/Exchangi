const rp = require("request-promise");

var texts = [];

module.exports = {
    addNewText,
    getTexts,
    refreshTextMessages
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

function getTexts(){
    return texts;   
}