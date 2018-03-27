var Specials = [];
var Generals = [];

/*function suggestGeneralSpecial(entityData) {

    if (!semanticSupportEnabled) {
        return;
    }

    var key = entityData.entityName;
    var generalizations = [];
    var specalizations = [];

    for (var i = 0; i < specialArray.length; i++) {
        console.log(specialArray);
        if (specialArray[i].from === key) {
            var relName = "GS_" + specialArray[i].from;
            if (moodler.existNode(relName)==false) {
                specalizations.push(specialArray[i]);
            }
        } else if (specialArray[i].to === key) {
            var relName = "GS_" + specialArray[i].from;
            if (moodler.existNode(relName)==false) {
                generalizations.push(specialArray[i]);
            }
        }
    }

    console.log(specalizations);

    if (generalizations.length != 0 || specalizations.length != 0) {

        var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p>Es werden zu dieser Entität Generalisierungen/Spezialisierungen empfohlen. Sollen diese angezeigt werden?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes2'>Yes</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo2'>No</button></div>", entityData.entityName);
        toast.find("#suggestYes2").on("click", function () {
            initGeneralModal(specalizations, generalizations);
        });
        toast.find("#suggestNo").on("click", function () {
        });
        notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion);
    }
}
*/

function suggestGeneralSpecial(entityData) {
    specials = [];
    generals = [];
    var key = entityData.entityName;

    for (var i = 0; i < specialArray.length; i++) {
        if (specialArray[i].from === key) {
            if (moodler.existParentChild(key, specialArray[i].to) == false) {
                specials.push(specialArray[i]);
            }
        }
        else if (specialArray[i].to === key) {
            if (moodler.existParentChild(specialArray[i].from, key) == false) {
                generals.push(specialArray[i]);
            }
        }
    }
    if (generals.length != 0 || specials.length != 0) {


        var tempS = specials;
        var tempG = generals;
        var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p>Es werden zu diesem Entitätstyp Generalisierungen/Spezialisierungen empfohlen. Sollen diese angezeigt werden?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes2'>Ja</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo2'>Nein</button></div>", entityData.entityName);
        toast.find("#suggestYes2").on("click", function () {
            initGeneralModal(tempG, tempS);
        });
        toast.find("#suggestNo2").on("click", function () {
        });
        notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion);
    }
}

function initGeneralModal(generals, specials) {
        $('#generalTable').find('tbody').html('');
        $('#specialTable').find('tbody').html('');
        for (var i = 0; i < generals.length; i++) {
            var id = "checkGeneral" + i;
            $('#generalTable').find('tbody').append("<tr><td>" + generals[i].from + "</td><td>" + generals[i].to + "</td><td>" + generals[i].total + "</td><td>" + generals[i].overlap + "</td><td><input type='checkbox' id='checkGeneral'></td></tr>");
            $('#checkGeneral').attr('id', id);
        }
        for (var j = 0; j < specials.length; j++) {
            var id = "checkSpecial" + j;
            $('#specialTable').find('tbody').append("<tr><td>" + specials[j].from + "</td><td>" + specials[j].to + "</td><td>" + specials[j].total + "</td><td>" + specials[j].overlap + "</td><td><input type='checkbox' id='checkSpecial'></td></tr>");
            $('#checkSpecial').attr('id', id);
        }
        Generals = generals;
        Specials = specials;
        $('#suggestModal2').modal('show');
    }

    // function initGeneralModal(specials, generals) {
    //     $('#generalTable').find('tbody').html('');
    //     $('#specialTable').find('tbody').html('');
    //     for (var i = 0; i < generals.length; i++) {
    //         var id = "checkGeneral" + i;
    //         $('#generalTable').find('tbody').append("<tr><td>" + generals[i].from + "</td><td>" + generals[i].to + "</td><td>" + generals[i].total + "</td><td>" + generals[i].overlap + "</td><td><input type='checkbox' id='checkGeneral'></td></tr>");
    //         $('#checkGeneral').attr('id', id);
    //     }
    //     for (var j = 0; j < specials.length; j++) {
    //         var id = "checkSpecial" + j;
    //         $('#specialTable').find('tbody').append("<tr><td>" + specials[j].from + "</td><td>" + specials[j].to + "</td><td>" + specials[j].total + "</td><td>" + specials[j].overlap + "</td><td><input type='checkbox' id='checkSpecial'></td></tr>");
    //         $('#checkSpecial').attr('id', id);
    //     }
      //   Generals = generals;
      //  Specials = specials;
    //     $('#suggestModal2').modal('show');
    // }

    function generalModalCallback() {
    var dataEntityG =null;
    var dataEntityS =null;
        for (var i = 0; i < Generals.length; i++) {
            if ($('#checkGeneral' + i).is(':checked')) {
                if (moodler.getEntityData(Generals[i].from) == null) {
                    var dataEntityG = {
                        entityName: Generals[i].from
                    };
                    moodler.addEntityNoGeneralSuggest(dataEntityG, 0, 0);
                }
                if(moodler.existNode("GS_"+Generals[i].from)==false) {
                    var children = [];
                    children.push(Generals[i].to);
                    //children.push(Generals[i].from);
                    var data = {
                        parent: Generals[i].from,
                        children: children,
                        isDisjoint: !Generals[i].overlap,
                        isPartial: !Generals[i].total
                    };
                    moodler.addGeneralizationSpecialization(data, 0, 0);
                }else{
                    moodler.addGeneralizationChild(Generals[i].from,Generals[i].to);
                }
            }
        }
        for (var j = 0; j < Specials.length; j++) {
            if ($('#checkSpecial' + j).is(':checked')) {
                if (moodler.getEntityData(Specials[j].to) == null) {
                    var dataEntityS = {
                        entityName: Specials[j].to
                    };
                    moodler.addEntityNoGeneralSuggest(dataEntityS, 0, 0);
                }
                if(moodler.existNode("GS_"+Specials[j].from)==false) {
                var children = [];
                children.push(Specials[j].to);
                //children.push(Specials[j].from);
                var data = {
                    parent: Specials[j].from,
                    children: children,
                    isDisjoint: !Specials[j].overlap,
                    isPartial: !Specials[j].total
                };
                moodler.addGeneralizationSpecialization(data, 0, 0);
            }else{
                    moodler.addGeneralizationChild(Specials[j].from,Specials[j].to);
                }
            }
        }
        $('#suggestModal2').modal('hide');
        if(dataEntityG!=null){
            suggestGeneralSpecial(dataEntityG);
        }
        if(dataEntityS!=null){
            suggestGeneralSpecial(dataEntityS);
        }
    }

