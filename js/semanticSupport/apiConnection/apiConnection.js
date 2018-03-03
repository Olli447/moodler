var apiKey = "";
var publicApiKey = "";
var isLoggedIn = false;
var baseURL = "http://132.252.51.194:3000/api/";
//var baseURL = "http://localhost:3000/api/";
var CHECK = baseURL + "auth/check";
var LOGIN = baseURL + "auth/login";
var MULTIPLICITY = baseURL + "language/multiplicity/";
var DOMAIN = baseURL + "domain/";
var RELATIONSHIP = baseURL + "language/relationshipName/";

function initConnection(previousCall) {
    $.ajax({
        url: encodeURI(LOGIN),
        type: 'POST',
        dataType: 'json',
        data: {username: "public", password: "public"},
        beforeSend: setHeader,
        error: function (response) {
            console.log("Connection to server failed!");
        },
        success: function (response) {
            apiKey = response.token.replace("JWT ", "");
            isLoggedIn = false;
            if (previousCall)
                previousCall.origin(previousCall.url, previousCall.successCallback, previousCall.errorCallback, previousCall.data);
        }
    });
}

function makeRequest(url, successCallback, errorCallback, config, data) {
    $.ajax({
        url: CHECK,
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader,
        error: function (response) {
            if (isLoggedIn) {

            } else {
                initConnection({
                    origin: makeRequest,
                    url: url,
                    successCallback: successCallback,
                    errorCallback: errorCallback,
                    data: data
                })
            }

        },
        success: function (response) {
            $.ajax({
                url: encodeURI(url),
                type: config.type,
                dataType: "json",
                data: data,
                beforeSend: setHeader,
                error: errorCallback,
                success: successCallback
            });
        }
    });
}

function login(username, passwaord, successCallback, errorCallback) {
    if (isLoggedIn === false) {
        $.ajax({
            url: encodeURI(LOGIN),
            type: 'POST',
            dataType: 'json',
            data: {username: username, password: passwaord},
            beforeSend: setHeader,
            error: function (response) {
                console.log("Connection to server failed!");
                errorCallback(response);
            },
            success: function (response) {
                publicApiKey = apiKey;
                apiKey = response.token.replace("JWT ", "");
                isLoggedIn = true;
                successCallback(response);
            }
        });
    }
    else {
        successCallback();
    }

}

function logout() {
    apiKey = publicApiKey;
    publicApiKey = "";
    isLoggedIn = false;
}

function setHeader(xhr) {
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', apiKey);
}