function checkName(){
    translateWord($('#entityName').val(), callURL);
}

function callURL(word) {
    jsonp('https://api.datamuse.com/words?sp=' + word +
        '&md=d&max=1', checkNameCallback);
}

function checkNameCallback(result) {
    var status = $("#status");
    var statusContent = [];

    if (typeof result === 'undefined')
    {
        statusContent.push({"name" : "s"});
    }
    else {
        statusContent.push(
            {
                "name": "p",
                "nameCorrect": result
            });
    }
    status.val(JSON.stringify(statusContent));
}

function jsonp(url, callback){
    $.getJSON(url, function(response) {
        $.each(response, function(key, val) {
            var obj = response[0];
            var name = obj.defHeadword.replace("\"","");
            //var nameString = JSON.stringify(name);
            callback(name);
        });
    });
}



