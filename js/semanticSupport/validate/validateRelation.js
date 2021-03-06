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

function checkThirdSingular(fullName, relName) {

    if (!semanticSupportEnabled) {
        return;
    }
    console.log(fullName);
    var name = fullName.split('_', 1)[0] ? fullName.split("_", 1)[0] : fullName;
    makeRequest(RELATIONSHIP + name,
        function (response) {
	        callBackThirdSingular(response, relName)
        },
        function (response) {
            console.log(response)
        },
        {
            type: "GET"
        });
}

function callBackThirdSingular(response, relName) {
    console.log(response);
    if(response.isSingular && response.isThirdPerson){
    }else{
	    var data = moodler.getRelationshipData(relName);
        moodler._diagram.startTransaction("setError");
        if (semanticSupportEnabled) {
	        moodler._diagram.model.setDataProperty(data, "warningRelation", false);
	        moodler._diagram.model.setDataProperty(data, "errorRelation", true);
            moodler._diagram.model.setDataProperty(data, "errorMessage", "Der Name der Relation muss in der 3. Person Singular sein");
        }
        moodler._diagram.model.setDataProperty(data, "warningMessage", null);
        moodler._diagram.commitTransaction("setError");
    }
}

function checkRelationEvent(event) {
    var part = event.subject.part;

    var toasts = document.getElementsByClassName("toast-title");
    var isSingleton = true;

    var index, len;
    for (index = 0, len = toasts.length; index < len; index++) {
        if ((toasts[index].innerText === part.data.relationshipName + ' - Fehler - Relationstyp steht nicht in der 3. Person - Singular') || (toasts[index].innerText === part.data.relationshipName + ' - Fehler - Relationstyp steht nicht in der 3. Person - Singular')) {
            isSingleton = false;
            break;
        }
    }

	if (part.category === "relationshipDiamond" && part.data.errorRelation === true && isSingleton) {
        notification.createError(part.data.relationshipName + ' - Fehler - Relationstyp steht nicht in der 3. Person - Singular', part.data.errorMessage, part.data.id);
    }
	if (part.category === "relationshipDiamond" && part.data.warningRelation === true && isSingleton) {
        notification.createWarning(part.data.relationshipName + ' - Fehler - Relationstyp steht nicht in der 3. Person - Singular', part.data.warningMessage, part.data.id);
    }
}

