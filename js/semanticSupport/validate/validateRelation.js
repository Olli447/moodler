function checkSpace() {
    var name = $('#relationshipName').val();
    var underscore = "_"
    name = name.split(' ').join(underscore);
    $('#relationshipName').val(name);
    $('#relationshipName').change();
}

function checkThirdSingular() {
    var fullName = $('#relationshipName').val();
    var name = fullName.split('_', 1)[0] ? fullName.split("_", 1)[0] : fullName;
    makeRequest(RELATIONSHIP + name,
        function (response) {
            callBackThirdSingular(response)
        },
        function (response) {
            console.log(response)
        },
        {
            type: "GET"
        });
}

function callBackThirdSingular(response) {
    console.log(response);
}



