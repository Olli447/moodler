function suggestRelation(from, to, name){
    console.log(from+"  "+to+"  "+name);
    for(var i= 0; i<relationArray.length; i++){
        console.log(from, to, relationArray[i].from, relationArray[i].to);
        if(from==relationArray[i].from && to==relationArray[i].to) {
            if (name.indexOf(relationArray[i].name.indexOf) == -1) {

	            if (semanticSupportEnabled) {
		            var text = "Wir empfehlen die Entitätstypen: " + from + " und " + to + " eventuell durch den Beziehungstyp: " + relationArray[i].name + " zu ersetzten. Wollen Sie diese ersetzten?"
		            var toast = notification.createInfo("Empfehlungen verfügbar", "<div class='row' style='margin-left: 0.33333%;'><p id='toastText'> " + text + "</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='suggestYes3'>Ja</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='suggestNo3'>Nein</button></div>", name);
		            toast.find("#suggestYes3").on("click", function () {
		            });
		            toast.find("#suggestNo3").on("click", function () {
		            });
		            notification.addEventListener(toast, "keydown", handleKeyDownEnterSuggestion, true);
	            }
            }
        }
    }
}

function suggestBetterName(relName, name, target, source) {
	//Lookup for a relation between target and source
	for (var i = 0; i < relationArray.length; i++) {
		if (
			(relationArray[i].from === source && relationArray[i].to === target) ||
			(relationArray[i].to === source && relationArray[i].from === target)
		) {
			if (name !== relationArray[i].name && semanticSupportEnabled) {
				notification.createWarning("Hinweis", "Das Modell sieht für den Beziehungstyp \"" + name + "\" zwischen \"" + source + "\" und \"" + target + "\" den Namen \"" + relationArray[i].name + "\" vor!", relName);
				break;
			}
		}
	}
}