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
        //Testweise mit R_NAME_0
        var data= moodler.getRelationshipData("R_"+$('#relationshipName').val()+"_0");
        moodler._diagram.startTransaction("setError");
        if (semanticSupportEnabled) {
            moodler._diagram.model.setDataProperty(data, "warning", false);
            moodler._diagram.model.setDataProperty(data, "error", true);
            moodler._diagram.model.setDataProperty(data, "errorMessage", "Der Name der Relation muss in der 3. Person Singular sein");
        }
        moodler._diagram.model.setDataProperty(data, "warningMessage", null);
        moodler._diagram.commitTransaction("setError");
    }
}

