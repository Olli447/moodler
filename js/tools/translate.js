window.translate = {

    translate: function (word, callback) {
        var key = "trnsl.1.1.20171211T152251Z.290e0af2ce51eee9.b835144280228df50dc98d9bfe5c3a3c620cd4c1";

        var uri = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20171211T152251Z.290e0af2ce51eee9.b835144280228df50dc98d9bfe5c3a3c620cd4c1&text=" + word + "&lang=en"
        var url = encodeURI(uri);

        $.getJSON(url, function (response) {
            callback(JSON.stringify(response.text[0]));
        });
    }
};