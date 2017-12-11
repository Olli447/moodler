function translateWord(word, callback)
{
    var key = "trnsl.1.1.20171211T152251Z.290e0af2ce51eee9.b835144280228df50dc98d9bfe5c3a3c620cd4c1";

    var uri ="https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20171211T152251Z.290e0af2ce51eee9.b835144280228df50dc98d9bfe5c3a3c620cd4c1&text="+word+"&lang=de-en"
    var url = encodeURI(uri);

    $.getJSON(url, function(response) {
        $.each(response, function(key, val) {
            var obj = response;
            var name = obj.text;
            var nameString = JSON.stringify(name[0]).split("\"").join("");
            callback(nameString);
        });
    });

}

function callbackTranslate(result){
    console.log(result);
}