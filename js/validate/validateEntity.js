function checkName(){
    var word = $('#entityName').val();
    jsonp('https://api.datamuse.com/words?sp=' + word +
        '&md=d&max=1', checkNameCallback);
}

function checkNameCallback(result) {
    alert(result);
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
            var name = obj.defHeadword;
            var nameString = JSON.stringify(name);
            callback(nameString);
        });
    });
}