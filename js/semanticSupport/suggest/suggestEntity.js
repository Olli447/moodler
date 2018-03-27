function suggestEntityAndRelation(entityData) {

    if (!semanticSupportEnabled) {
        return;
    }

    var key = entityData.entityName;
    var fromEntity = moodler._diagram.model.findNodeDataForKey(key);

    var toEntityRelations = [];
    var toEntityNodes = [];

	//Look for relationships were the fromEntity is present
    for (var i = 0; i < relationArray.length; i++) {
        if (relationArray[i].from === fromEntity.key || relationArray[i].to === fromEntity.key) {
            var tempEntityFrom = moodler._diagram.model.findNodeDataForKey(relationArray[i].from);
            var tempEntityTo = moodler._diagram.model.findNodeDataForKey(relationArray[i].to);

            if (!tempEntityFrom) {
                for (var j = 0; j < entityArray.length; j++) {
                    if (relationArray[i].from === entityArray[j].name) {
                        if (!findObjectByKey(toEntityNodes, "key", entityArray[j].name)) {
                            toEntityNodes.push({
                                key: entityArray[j].name,
                                name: entityArray[j].name,
                                properties: entityArray[j].properties,
                                needsToBeCreated: true
                            });
                            break;
                        }
                    }
                }

                if (!findObjectByKey(toEntityNodes, "key", tempEntityTo.key))
                    toEntityNodes.push({
                        key: tempEntityTo.key,
                        name: tempEntityTo.entityName,
                        properties: tempEntityTo.properties,
                        needsToBeCreated: false
                    });
            }

            else if (!tempEntityTo) {
                for (var j = 0; j < entityArray.length; j++) {
                    if (relationArray[i].to === entityArray[j].name) {
                        if (!findObjectByKey(toEntityNodes, "key", entityArray[j].name)) {
                            toEntityNodes.push({
                                key: entityArray[j].name,
                                name: entityArray[j].name,
                                properties: entityArray[j].properties,
                                needsToBeCreated: true
                            });
                            break;
                        }
                    }
                }
                if (!findObjectByKey(toEntityNodes, "key", tempEntityFrom.key))
                    toEntityNodes.push({
                        key: tempEntityFrom.key,
                        name: tempEntityFrom.entityName,
                        properties: tempEntityFrom.properties,
                        needsToBeCreated: false
                    });
            }

            else {
                if (!findObjectByKey(toEntityNodes, "key", tempEntityFrom.key))
                    toEntityNodes.push({
                        key: tempEntityFrom.key,
                        name: tempEntityFrom.entityName,
                        properties: tempEntityFrom.properties,
                        needsToBeCreated: false
                    });

                if (!findObjectByKey(toEntityNodes, "key", tempEntityTo.key))
                    toEntityNodes.push({
                        key: tempEntityTo.key,
                        name: tempEntityTo.entityName,
                        properties: tempEntityTo.properties,
                        needsToBeCreated: false
                    });
            }

            if (toEntityRelations.length === 0) {
                toEntityRelations.push(relationArray[i]);
            }
            else if (toEntityRelations[toEntityRelations.length - 1].name !== relationArray[i].name) {
                toEntityRelations.push(relationArray[i]);
            }

        }
    }
    if (toEntityNodes.length === 0 && toEntityRelations.length === 0) {
        return;
    }
    var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p>Es gibt Empfehlungen für weitere Beziehungs- und ggf. Entitätstypen. Sollen diese angezeigt werden?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes'>Ja</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo'>Nein</button></div>", entityData.entityName);
    toast.find("#suggestYes").on("click", function () {
        initSuggestionModal(toEntityRelations, toEntityNodes)
    });
    toast.find("#suggestNo").on("click", function () {
        //NoOp
    });
    notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion);
}

function initSuggestionModal(relations, entities) {
    var relationTable = document.getElementById("relationTable").querySelector("tbody");
    var entityTable = document.getElementById("entityTable").querySelector("tbody");

    for (var i = 0; i < relations.length; i++) {
        var row = relationTable.insertRow();
        row.setAttribute("id", relations[i].name);
        row.setAttribute("data-content", JSON.stringify(relations[i]));
        var nameCell = row.insertCell();
        nameCell.innerText = relations[i].name;
        var fromCell = row.insertCell();
        fromCell.innerText = relations[i].from;
        var toCell = row.insertCell();
        toCell.innerText = relations[i].to;
        var cardLCell = row.insertCell();
        cardLCell.innerText = relations[i].cardFrom;
        var cardRCell = row.insertCell();
        cardRCell.innerText = relations[i].cardTo;
        var checkboxCell = row.insertCell();
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("click", function (event) {
            var currentElement = event.currentTarget.parentElement.parentElement;
            var data = JSON.parse(currentElement.getAttribute("data-content"));
            var fromElement = entityTable.querySelector("#" + data.from);
            var toElement = entityTable.querySelector("#" + data.to);
            var checked = event.currentTarget.checked;
            for (var x = 0; x < entities.length; x++) {
                var count = 0;
                if (!checked) {
                    if (toElement) {
                        count = parseInt(toElement.getAttribute("data-count")) - 1;
                        if (isNaN(count)) {
                            count = 0;
                        }
                        toElement.setAttribute("data-count", count + "");
                        if (count === 0) {
                            toElement.style.backgroundColor = "";
                        }
                    }
                    if (fromElement) {
                        count = parseInt(fromElement.getAttribute("data-count")) - 1;
                        if (isNaN(count)) {
                            count = 0;
                        }
                        fromElement.setAttribute("data-count", count + "");
                        if (count === 0) {
                            fromElement.style.backgroundColor = "";
                        }
                    }
                    break;
                }
                // Unterscheidung noch nicht wirklich notwendig - Für später aber vielleicht notwendig
                else if (entities[x].key === data.from) {
                    if (entities[x].needsToBeCreated && fromElement) {
                        fromElement.style.backgroundColor = "rgb(2,255,42)";
                        count = parseInt(fromElement.getAttribute("data-count")) + 1;
                        if (isNaN(count)) {
                            count = 1;
                        }
                        fromElement.setAttribute("data-count", count + "");
                    } else if (!entities[x].needsToBeCreated && fromElement) {
                        fromElement.style.backgroundColor = "rgb(255,204,75)";
                        count = parseInt(fromElement.getAttribute("data-count")) + 1;
                        if (isNaN(count)) {
                            count = 1;
                        }
                        fromElement.setAttribute("data-count", count + "");
                    }
                }
                else if (entities[x].key === data.to) {
                    if (entities[x].needsToBeCreated && toElement) {
                        toElement.style.backgroundColor = "rgb(2,255,42)";
                        count = parseInt(toElement.getAttribute("data-count")) + 1;
                        if (isNaN(count)) {
                            count = 1;
                        }
                        toElement.setAttribute("data-count", count + "");
                    } else if (!entities[x].needsToBeCreated && toElement) {
                        toElement.style.backgroundColor = "rgb(255,204,75)";
                        count = parseInt(toElement.getAttribute("data-count")) + 1;
                        if (isNaN(count)) {
                            count = 1;
                        }
                        toElement.setAttribute("data-count", count + "");
                    }
                }
            }

        });
        checkboxCell.appendChild(checkbox)
    }

    for (var j = 0; j < entities.length; j++) {
        var row2 = entityTable.insertRow();
        row2.setAttribute("id", entities[j].name);
        row2.setAttribute("data-content", JSON.stringify(entities[j]));
        var nameCell2 = row2.insertCell();
        nameCell2.innerText = entities[j].name;
        var attributesCell = row2.insertCell();
        var content = "";
	    if (entities[j].properties) {
		    for (var o = 0; o < entities[j].properties.length; o++) {
			    content += entities[j].properties[o].propertyName;
			    content += " : ";
			    content += entities[j].properties[o].propertyType;
			    content += "<br>";
		    }
        }
        attributesCell.innerHTML = content;
    }

    $("#suggestModal").modal('show');
    $('#suggestModal').on('hide.bs.modal', finalizeSuggestModal);
}

function suggestionModalCallback() {
    var relationTable = document.getElementById("relationTable");
    var entitiyTable = document.getElementById("entityTable");

    var relationElements = relationTable.querySelectorAll("tr");
    var relations = [];

    for (var i = 1; i < relationElements.length; i++) {
        var checkbox = relationElements[i].querySelector("tr input");
        if (checkbox.checked)
            relations.push(JSON.parse(relationElements[i].getAttribute("data-content")));
    }

    var entityElements = entitiyTable.querySelectorAll("tr");
    var entities = [];

    for (var j = 1; j < entityElements.length; j++) {
        entities.push(JSON.parse(entityElements[j].getAttribute("data-content")));
    }

    for (var x = 0; x < relations.length; x++) {

	    moodler._diagram.startTransaction("Add Relationship: " + relations[x].name);

        if (!moodler._diagram.findNodeForKey(relations[x].from)) {
            for (var u1 = 0; u1 < entities.length; u1++) {
                if (entities[u1].name === relations[x].from) {
                    moodler._diagram.model.addNodeData({
                        key: entities[u1].name,
                        entityName: entities[u1].name,
                        properties: entities[u1].properties,
                        category: "entity"
                    });
                    break;
                }
            }

        }

        if (!moodler._diagram.findNodeForKey(relations[x].to)) {
            for (var u2 = 0; u2 < entities.length; u2++) {
                if (entities[u2].name === relations[x].to) {
                    moodler._diagram.model.addNodeData({
                        key: entities[u2].name,
                        entityName: entities[u2].name,
                        properties: entities[u2].properties,
                        category: "entity"
                    });
                    break;
                }
            }
        }

        var relName = "R_" + relations[x].name;
        var relNameSuffix = 0;

        while (moodler._diagram.model.findNodeDataForKey(relName + "_" + relNameSuffix) !== null) {
            relNameSuffix++;
        }

        relName = relName + "_" + relNameSuffix;

        moodler._diagram.model.addNodeData({
            key: relName,
            relationshipName: relations[x].name,
            category: "relationshipDiamond"
        });

        //Adding Source Link
        moodler._diagram.model.addLinkData({
            from: relations[x].from,
            to: relName,
            role: "", //TODO: Rollen im Metamodell ergänzen und im Datenmodell erfassen!!!
            multiplicity: relations[x].cardFrom,
            category: "relationshipLine"
        });

        //Adding Target Link
        moodler._diagram.model.addLinkData({
            from: relations[x].to,
            to: relName,
            role: "", //TODO: Rollen im Metamodell ergänzen und im Datenmodell erfassen!!!
            multiplicity: relations[x].cardTo,
            category: "relationshipLine"
        });

        moodler._diagram.commitTransaction("Add Relationship: " + relations[x].name);
    }
    $("#suggestModal").modal('hide');
}

function finalizeSuggestModal() {
    var relationTable = document.getElementById("relationTable");
    var entityTable = document.getElementById("entityTable");

    relationTable.querySelector("tbody").innerHTML = "";
    entityTable.querySelector("tbody").innerHTML = "";
}

function handleKeyDownEnterSuggestion(event) {
    if (event.code === 'Enter') {
        $('#suggestYes').click();

        return false;
    }
}