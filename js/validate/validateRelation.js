function checkSpace(){
    var name = $('#relationshipName').val();
    var underscore ="_"
    name = name.split(' ').join(underscore);
    $('#relationshipName').val(name);
    $('#relationshipName').change();
}

function checkThirdSingular() {
    var name = $('#relationshipName').val();
    name = name.substring(0,name.indexOf("_"));
    console.log(name);
    getThirdSing.getThirdSing(name, callBackThirdSingular)
}

function callBackThirdSingular(response){
    console.log(response);
}

window.getThirdSing = {

    apiKey: " ",
    getThirdSing: function (word, callback) {

        var uri = "http://132.252.51.194:3000/api/auth/";

        var xhr = $.ajax({
            url: encodeURI(uri + "check"),
            type: 'GET',
            dataType: 'json',
            beforeSend: getThirdSing.setHeader,
            error: function (response) {
                console.log("No key acquired yet!");
                $.ajax({
                    url: encodeURI(uri + "login"),
                    type: 'POST',
                    dataType: 'json',
                    data: {username: "public", password: "public"},
                    beforeSend: getThirdSing.setHeader,
                    error: function (response) {
                        console.log("Login failed!");
                    },
                    success: function (response) {
                        var apiKey = response.token.replace("JWT ", "");
                        identify.apiKey = apiKey;
                        getThirdSing.getThirdSingCallback(word, callback);
                    }
                });
            },
            success: function (response) {
                getThirdSing.getThirdSingCallback(word, callback);
            }
        });
    },
    getThirdSingCallback: function (word, callback) {
        var uri = "http://132.252.51.194:3000/api/language/relationshipName/" + word;
        //var url = encodeURI(uri);
        var url = uri;

        var xhr = $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            beforeSend: getThirdSing.setHeader,
            error: function (response) {
                console.log(response);
            },
            success: function (response) {
                callback(response);
            }
        });
    },
    setHeader: function (xhr) {
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Authorization', identify.apiKey);
    },
};



