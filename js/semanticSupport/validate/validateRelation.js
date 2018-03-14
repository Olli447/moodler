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

function checkThirdSingular() {

    if (!semanticSupportEnabled) {
        return;
    }

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
    if(response.isSingular && response.isThirdPerson == true){

    }else{
        var allData = moodler.getEntityList();

        var index, len, data;
        for (index = 0, len = allData.length; index < len; ++index) {
            if (allData[index].entityName === entityName) {
                data = allData[index];
                break;
            }
        }

        moodler._diagram.startTransaction("setError");
        if (semanticSupportEnabled) {
            moodler._diagram.model.setDataProperty(data, "warning", false);
            moodler._diagram.model.setDataProperty(data, "error", isPlural); //TODO: Where does "isPlural" come form? Copy-Paste?
        }
        moodler._diagram.model.setDataProperty(data, "warningMessage", null);
    }
}

