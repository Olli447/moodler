function checkName(){
    var word = $('#entityName').val();

    translate.translate(word, checkNameAfterTransalateCallback);
}

function checkNameAfterTransalateCallback(word) {
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
    console.log("Status " + status.val())
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
        callback(response[0].defHeadword);
    });
}