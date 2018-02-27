function checkAtomar() {
    var modal = $("#entity-modal");
    var attributes = [];

    modal.find(".cloneable").each(function () {
        attributes.push({
            propertyName: $(this).find("#attributeName").val()
        });
    });

    for (var i = 0; i < attributes.length; i++) {
        console.log("dada" + attributes[i]);
        switch (attributes[i].propertyName) {
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
                    moodler.addEntity(dataAdresse, 800, 800);

                    var dataStadt = {
                        entityName: "Stadt",
                        properties: attributesStadt
                    };
                    moodler.addEntity(dataStadt, 300, 300);

                    var dataLand = {
                        entityName: "Land",
                        properties: attributesLand
                    };
                    moodler.addEntity(dataLand, 1600, 1600);
                });
                modal.find("#noAdresse").on("click", function () {
                });
            case "Name":
                break;
            case "Alter":
                break;
            case "Jahresgehalt":
                break;
        }
    }
}