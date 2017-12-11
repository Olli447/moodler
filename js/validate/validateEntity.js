function checkName(){
    var word = $('#entityName').val();

    alert(jsonp('https://api.datamuse.com/words?sp=' + word +
        '&md=d&max=1'));

}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var json = JSON.parse(xmlHttp.responseText);
    return json["defHeadword"];
}

function jsonp(url){


    $.getJSON(url, function(response) {
        $.each(response, function(key, val) {
            var obj = response[0];
            var name = obj[0];
            console.log(obj);
            //blabla
            return obj;
        });
    });
}