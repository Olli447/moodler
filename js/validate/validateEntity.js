function checkName(){
    var word = $('#entityName').val();

    //identify.identify(word, checkNameCallback)
    return true;
}

function checkNameCallback(entityName, isPlural, basicWord) {
    var allData = moodler.getEntityList();

    var index, len, data;
    for (index = 0, len = allData.length; index < len; ++index) {
        if (allData[index].entityName === entityName) {
            data = allData[index];
            break;
        }
    }

    moodler._diagram.startTransaction("setError");
    moodler._diagram.model.setDataProperty(data, "error", isPlural);
    if (isPlural)
        moodler._diagram.model.setDataProperty(data, "errorMessage", "The entity's name needs to be in singular.<br>You could write: \"" + basicWord + "\"!");
    moodler._diagram.commitTransaction("setError");
}

function checkNameEvent(event) {
    var part = event.subject.part;
    if (part.category === "entity" && part.data.error === true) {
        toastr.error(part.data.errorMessage, part.data.entityName + ' - Fehler - Einzahl/Mehrzahl')
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
        //-------------------------------
        console.log('Selection: ' + suggestion);
        toastr.info("<div class='row' style='margin-left: 0.33333%;'><p>Do you want to add some suggested attributes to your form?</p></div><div class='row col-md-offset-1'><button type='button' class='btn btn-raised btn-success' id='yesBtn'>Yes</button><button type='button' class='btn btn-raised btn-error' id='noBtn'>No</button></div>", "Need a helping hand?");
        $('#yesBtn').on('click', function (e) {
            //TODO: ADD check if Attribute allready exists
            var data = autocomplete.sourceEntity[autocomplete.szenario]
            for (var key in data.entity) {
                if (!data.entity.hasOwnProperty(key)) continue;
                if (data.entity[key].fullName === suggestion) {
                    for (var prop in data.entity[key].property) {
                        if (!data.entity[key].property.hasOwnProperty(prop)) continue;
                        if (modal.find(".cloneable:last-of-type").find("#attributeName").val().length !== 0 || modal.find(".cloneable:last-of-type").find("#attributeType").val().length !== 0) {
                            modal.find(".cloneable:last-of-type").find(".add").click();
                        }
                        var propertyLine = modal.find(".cloneable:last-of-type");
                        propertyLine.find("#attributeName").val(data.entity[key].property[prop].fullName).change();
                        propertyLine.find("#attributeType").val(data.entity[key].property[prop].type).change();
                        propertyLine.find(".add").click();
                    }
                    modal.find(".cloneable:last-of-type").find(".remove").click();
                }
            }
        });
        $('#noBtn').on('click', function (e) {
            //nothing
        });
//--------------------------------
    });
    modal.on('hide.bs.modal', function (event) {
        modal.find("#entityName").off('typeahead:select');
        modal.find("#entityName").typeahead('destroy');
    });
}