function checkName(){
    var word = $('#entityName').val();
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

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var json = JSON.parse(xmlHttp.responseText);
    return json["defHeadword"];
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