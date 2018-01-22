function Beziehung(from, to, cardFrom, cardTo) {
    this.from = from;
    this.to = to;
    this.cardFrom = cardFrom;
    this.cardTo = cardTo;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function readAll() {
    readTextFile("json/domain.json", function(text){
        readEntitys(text);
        readRelations(text);
    });
}

function readRelations(data) {
    var array;
    var mydata = JSON.parse(data);
    var relationarray = mydata.linkDataArray;
    array = [];
    for (var i = 0; i < relationarray.length; i++) {
        if (relationarray[i].category == "relationshipLine") {
            array.push(new Beziehung(relationarray[i].from, relationarray[i].to, 0, relationarray[i].multiplicity));
        }
    }
    var finalarray = [array.length / 2];
    for (var i = 0; i < array.length; i++) {
        var first = array[i];
        for (var j = 0; j < array.length; j++) {
            if (i != j) {
                if (array[i].cardTo == array[j].cardTo) {
                    finalarray.push(new Beziehung(array[i].from, array[j].from, array[i].cardTo, array[j].cardTo));
                }
            }
        }
    }
    for(var i=0; i<finalarray.length; i++){
        console.log("Bezehung von"+ finalarray[i].from+ " card: "+finalarray[i].cardFrom+ " zu: "+ finalarray[i].to + " card: "+finalarray[i].to);
    }
}

function readEntitys(data) {

    var array = [];
    var mydata = JSON.parse(data);
    var entityarray = mydata.nodeDataArray;
    for (var i = 0; i < entityarray.length; i++) {
        if (entityarray[i].category == "entity") {
            array.push(entityarray[i].entityName);
        }
    }
    for (var i = 0; i < array.length; i++) {
        console.log(array[i]);
    }
}