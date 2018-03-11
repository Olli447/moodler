function checkAtomar() {

    if (!semanticSupportEnabled) {
        return;
    }

    var modal = $("#entity-modal");
    var attributes = [];
    var key = $('#entityName').val();

    modal.find(".cloneable").each(function () {
        attributes.push({
            propertyName: $(this).find("#attributeName").val()
        });
    });

    for (var i = 0; i < attributes.length; i++) {
        console.log("dada" + attributes[i]);
        switch(attributes[i].propertyName){
            case "Adresse":
                var modal = notification.createWarning("Hinweis", "<div class='row' style='margin-left: 0.33333%;'><p>Adresse sollte nicht als Attribut modelliert werden. Wollen Sie die Entitätstypen Adresse, Stadt und Land hinzufügen?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='yesAdresse'>Ja</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='noAdresse'>Nein</button></div>");
                modal.find("#yesAdresse").on("click", function () {
                    var attributesAdresse = [];
                    var attributesStadt = [];
                    var attributesLand = [];


                    attributesAdresse.push({
                        propertyName: "Straße",
                        propertyType: "String"
                    });
                    attributesAdresse.push({
                        propertyName: "Hausnummer",
                        propertyType: "String"
                    });
                    attributesAdresse.push({
                        propertyName: "PLZ",
                        propertyType: "String"
                    });

                    attributesStadt.push({
                        propertyName: "Name",
                        propertyType: "String"
                    });

                    attributesLand.push({
                        propertyName: "Name",
                        propertyType: "String"
                    });


                    var dataAdresse = {
                        entityName: "Adresse",
                        properties: attributesAdresse
                    };
                    moodler.addEntity(dataAdresse, 0, 0);

                    var dataStadt = {
                        entityName: "Stadt",
                        properties: attributesStadt
                    };
                    moodler.addEntity(dataStadt, 0, 0);

                    var dataLand = {
                        entityName: "Land",
                        properties: attributesLand
                    };
                    moodler.addEntity(dataLand, 0, 0);

                    //remove Atribute by deleting and creating new Entity
                    var data = moodler.getEntityData(key);
                    console.log(data);
                    for(var i = 0; i< data.properties.length; i++){
                        if(data.properties[i].propertyName=="Adresse"){
                            data.properties.splice(i,1);
                        }
                    }
                    var entitys = moodler.getEntityList();
                    for(var i = 0; i<entitys.length;i++) {
                        console.log(entitys[i]);
                        if (entitys[i].key == key) {
                            moodler.deleteEntity(key);
                        }
                    }
                    moodler.addEntity(data, 0, 0);

                    //creating realtionships
                    var linkAdresse = {
                        source: key,
                        target: "Adresse",
                        name: "wohnt_in",
                        sourceRole: "",
                        sourceMultiplicity: "0,*",
                        targetRole: "",
                        targetMultiplicity: "1,1"
                    };
                    moodler.addRelationship(linkAdresse, 0, 0);

                    //creating realtionships
                    var linkOrt = {
                        source: "Adresse",
                        target: "Stadt",
                        name: "liegt_in",
                        sourceRole: "",
                        sourceMultiplicity: "1,*",
                        targetRole: "",
                        targetMultiplicity: "1,*"
                    };
                    moodler.addRelationship(linkOrt, 0, 0);

                    //creating realtionships
                    var linkLand = {
                        source: "Stadt",
                        target: "Land",
                        name: "liegt_in",
                        sourceRole: "",
                        sourceMultiplicity: "1,*",
                        targetRole: "",
                        targetMultiplicity: "1,1"
                    };
                    moodler.addRelationship(linkLand, 0, 0);
                });
                modal.find("#noAdresse").on("click", function () {
                });
                break;
            case "Name":
                var modal = notification.createWarning("Hinweis", "<div class='row' style='margin-left: 0.33333%;'><p>Ein Name sollte nicht alleine stehen und in Name und Vorname aufgeteilt werden. Möchtest du Vorname hinzufügen?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='yesName'>Ja</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='noName'>Nein</button></div>");
                modal.find("#yesName").on("click", function () {

                });
                modal.find("#noName").on("click", function () {
                });
                break;
            case "Alter":
                break;
            case "Jahresgehalt":
                break;
        }
    }
}