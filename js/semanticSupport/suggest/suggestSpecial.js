var Specials =[];
var Generals=[];
function suggestGeneralSpecial(entityData) {

    if (!semanticSupportEnabled) {
        return;
    }

    var key = entityData.entityName;
    var generalizations = [];
    var specalizations = [];

    for (var i = 0; i < specialArray.length; i++) {
        if (specialArray[i].from === key) {
            specalizations.push(specialArray[i]);
        } else if (specialArray[i].to === key) {
            generalizations.push(specialArray[i]);
        }
    }


        if (generalizations.length !=0 || specalizations.length != 0) {

            var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p>Es werden zu dieser Entität Generalisierungen/Spezialisierungen empfohlen. Sollen diese angezeigt werden?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes2'>Yes</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo2'>No</button></div>", entityData.entityName);
            toast.find("#suggestYes2").on("click", function () {
                initGeneralModal(specalizations, generalizations);
            });
            toast.find("#suggestNo").on("click", function () {
            });
            notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion);
        }
    }

function initGeneralModal(specials, generals){
    $('#generalTable').find('tbody').html('');
    $('#specialTable').find('tbody').html('');
    for(var i=0; i< generals.length; i++){
        var id = "checkGeneral"+i;
        $('#generalTable').find('tbody').append("<tr><td>"+generals[i].from+"</td><td>"+generals[i].to+"</td><td>"+generals[i].total+"</td><td>"+generals[i].overlap+"</td><td><input type='checkbox' id='checkGeneral'></td></tr>" );
        $('#checkGeneral').attr('id', id);
    }
    for(var j=0; j< specials.length; j++){
        var id = "checkSpecial"+j;
        $('#specialTable').find('tbody').append("<tr><td>"+specials[i].from+"</td><td>"+specials[i].to+"</td><td>"+specials[i].total+"</td><td>"+specials[i].overlap+"</td><td><input type='checkbox' id='checkSpecial'></td></tr>" );
        $('#checkSpecial').attr('id', id);
    }
    Generals=generals;
    Specials=specials;
    $('#suggestModal2').modal('show');
}

function generalModalCallback(){
    for(var i=0; i<Generals.length; i++){
        if($('#checkGeneral'+i).is(':checked')){
            if(moodler.getEntityData(Generals[i].from)==null) {
                var dataEntity = {
                    entityName: Generals[i].from
                };
                moodler.addEntity(dataEntity, 0, 0);
            }

            var children = [];
            children.push(Generals[i].to);
            children.push(Generals[i].from);
            var data = {
                parent: Generals[i].from,
                children: children,
                isDisjoint: !Generals[i].overlap,
                isPartial: !Generals[i].total
            };
            moodler.addGeneralizationSpecialization(data, 0, 0);
        }
    }
    for(var j=0; j<Specials.length; j++){
        if($('#checkSpecial'+j).is(':checked')){
            if(moodler.getEntityData(Specials[i].to)==null) {
                var dataEntity = {
                    entityName: Specials[i].to
                };
                moodler.addEntity(dataEntity, 0, 0);
            }
            var children = [];
            children.push(Specials[i].to);
            children.push(Specials[i].from);
            var data = {
                parent: Specials[i].from,
                children: children,
                isDisjoint: !Specials[i].overlap,
                isPartial: !Specials[i].total
            };
            moodler.addGeneralizationSpecialization(data, 0, 0);
        }
    }
    $('#suggestModal2').modal('hide');
}

