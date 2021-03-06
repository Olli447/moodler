window.identify = {

    apiKey: " ",
    identify: function (word, callback) {

        apiConnection.makeRequest();

        var uri = "http://132.252.51.194:3000/apiConnection/auth/";

        var xhr = $.ajax({
            url: encodeURI(uri + "check"),
            type: 'GET',
            dataType: 'json',
            beforeSend: identify.setHeader,
            error: function (response) {
                console.log("No key acquired yet!");
                $.ajax({
                    url: encodeURI(uri + "login"),
                    type: 'POST',
                    dataType: 'json',
                    data: {username: "public", password: "public"},
                    beforeSend: identify.setHeader,
                    error: function (response) {
                        console.log("Login failed!");
                    },
                    success: function (response) {
                        var apiKey = response.token.replace("JWT ", "");
                        identify.apiKey = apiKey;
                        identify.identifyCallback(word, callback);
                    }
                });
            },
            success: function (response) {
                identify.identifyCallback(word, callback);
            }
        });
    },
    identifyCallback: function (word, callback) {
        var uri = "http://132.252.51.194:3000/apiConnection/language/multiplicity/" + word;
        var url = encodeURI(uri);

        var xhr = $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            beforeSend: identify.setHeader,
            error: function (response) {
                console.log(response);
                callback(word, null, response.responseJSON.error)
            },
            success: function (response) {
                callback(word, response.isPlural, response.basicForm);
            }
        });
    },
    setHeader: function (xhr) {
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Authorization', identify.apiKey);
    },
};