function checkSpace() {

    if (!semanticSupportEnabled) {
        return;
    }

    var name = $('#relationshipName').val();
    var underscore = "_"
    name = name.split(' ').join(underscore);
    $('#relationshipName').val(name);
    $('#relationshipName').change();
}

function checkThirdSingular(fullName) {

    if (!semanticSupportEnabled) {
        return;
    }
    console.log(fullName);
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
    if(response.isSingular && response.isThirdPerson){
        console.log("YES");
    }else{
        var data= moodler.getRelationshipData($('#relationshipName').val());
        console.log(data);
        moodler._diagram.startTransaction("setError");
        if (semanticSupportEnabled) {
            moodler._diagram.model.setDataProperty(data, "warning", false);
            moodler._diagram.model.setDataProperty(data, "error", isPlural); //TODO: Where does "isPlural" come form? Copy-Paste?
        }
        moodler._diagram.model.setDataProperty(data, "warningMessage", null);
        moodler._diagram.model.setDataProperty(data, "error", isPlural);
    }
}

