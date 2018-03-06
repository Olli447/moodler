function checkName() {
    var word = $('#entityName').val();

    makeRequest(MULTIPLICITY + word,
        function (response) {
            checkNameCallback(word, response.isPlural, response.basicForm);
        },
        function (response) {
            console.log(response);
            checkNameCallback(word, null, response.responseJSON.error)
        },
        {
            type: "GET"
        });
    return true;
}

function checkNameCallback(entityName, isPlural, basicWord) {

    for (var i = 0; i < entityArray; i++) {
        if (entityName === entityArray[i].name) {
            return;
        }
    }
    var allData = moodler.getEntityList();

    var index, len, data;
    for (index = 0, len = allData.length; index < len; ++index) {
        if (allData[index].entityName === entityName) {
            data = allData[index];
            break;
        }
    }


    if (entityName !== basicWord) {
        if (isPlural !== null) {
            moodler._diagram.startTransaction("setError");
            moodler._diagram.model.setDataProperty(data, "warning", false);
            moodler._diagram.model.setDataProperty(data, "warningMessage", null);
            moodler._diagram.model.setDataProperty(data, "error", isPlural);
            if (isPlural)
                moodler._diagram.model.setDataProperty(data, "errorMessage", "Der Name der Entität muss im Singualar sein.<br>Besser: \"" + basicWord + "\"");
            moodler._diagram.commitTransaction("setError");
        } else {
            moodler._diagram.startTransaction("setWarning");
            moodler._diagram.model.setDataProperty(data, "error", false);
            moodler._diagram.model.setDataProperty(data, "errorMessage", null);
            moodler._diagram.model.setDataProperty(data, "warning", true);
            moodler._diagram.model.setDataProperty(data, "warningMessage", "The System returned:<br>" + basicWord + "!");
            moodler._diagram.commitTransaction("setWarning");
        }
    }

}

function checkNameEvent(event) {
    var part = event.subject.part;

    var toasts = document.getElementsByClassName("toast-title");
    var isSingleton = true;

    var index, len;
    for (index = 0, len = toasts.length; index < len; index++) {
        if ((toasts[index].innerText === part.data.entityName + ' - Fehler - Einzahl/Mehrzahl') || (toasts[index].innerText === part.data.entityName + ' - Fehler - API Abfrage')) {
            isSingleton = false;
            break;
        }
    }

    if (part.category === "entity" && part.data.error === true && isSingleton) {
        notification.createError(part.data.entityName + ' - Fehler - Einzahl/Mehrzahl', part.data.errorMessage, part.data.id);
    }
    if (part.category === "entity" && part.data.warning === true && isSingleton) {
        notification.createWarning(part.data.entityName + ' - Fehler - API Abfrage', part.data.warningMessage, part.data.id);
    }
}

function initSuggestName(modal) {
    modal.find("#entityName").typeahead({
            minLength: 1,
            highlight: true
        },
        {
            source: autocomplete.search
        });
    modal.find("#entityName").on('typeahead:select', function (event, suggestion) {
        //console.log('Selection: ' + suggestion);
        var infoToast = notification.createInfo("Brauchen Sie eine helfende Hand?", "<div class='row' style='margin-left: 0.33333%;'><p>Wollen Sie empfohlene Attribute zum Formular hinzufügen?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='yesBtn'>Yes</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='noBtn'>No</button></div>", "modal");
        notification.addEventListener(infoToast, "keydown", handleKeydownEnterEntity);
        infoToast.find('#yesBtn').on('click', function (e) {
            //TODO: ADD check if Attribute allready exists
            var data = entityArray;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name === suggestion) {
                    addAttributes(modal, data[i].properties)
                }
            }
        });
        infoToast.find('#noBtn').on('click', function (e) {
            //nothing
        });
//--------------------------------
    });
    modal.on('hide.bs.modal', function (event) {
        modal.find("#entityName").off('typeahead:select');
        modal.find("#entityName").typeahead('destroy');
    });
}

function addAttributes(modal, data) {
    for (var i = 0; i < data.length; i++) {
        if (modal.find(".cloneable:last-of-type").find("#attributeName").val().length !== 0 || modal.find(".cloneable:last-of-type").find("#attributeType").val().length !== 0) {
            modal.find(".cloneable:last-of-type").find(".add").click();
        }
        var propertyLine = modal.find(".cloneable:last-of-type");
        propertyLine.find("#attributeName:last-of-type").val(data[i].propertyName).change();
        propertyLine.find("#attributeType:last-of-type").val(data[i].propertyType).change();
    }
}

function handleKeydownEnterEntity(event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        $('#yesBtn').click();

        return false;
    }
}