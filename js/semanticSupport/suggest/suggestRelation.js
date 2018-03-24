function suggestRelation(from, to, name){
    console.log(from+"  "+to+"  "+name);
    for(var i= 0; i<relationArray.length; i++){
        console.log(from, to, relationArray[i].from, relationArray[i].to);
        if(from==relationArray[i].from && to==relationArray[i].to) {
            if (name.indexOf(relationArray[i].name.indexOf) == -1) {
                var text= "Wir empfehlen die Entitäten: "+from+" und "+to+" eventuell durch die Relation: "+relationArray[i].name+" zu ersetzten. Wollen Sie diese ersetzten?"
                var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p id='toastText'></p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes3'>Yes</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo3'>No</button></div>", name);
                $('#toastText').val(text);
                toast.find("#suggestYes3").on("click", function () {
                });
                toast.find("#suggestNo3").on("click", function () {
                });
                notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion);
            }
        }
    }
}