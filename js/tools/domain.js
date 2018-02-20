var entityArray=[];
var relationArray=[];
var specialArray=[];

function Beziehung(from, to, cardFrom, cardTo) {
    this.from = from;
    this.to = to;
    this.cardFrom = cardFrom;
    this.cardTo = cardTo;
}

function Specialization(from, to, total) {
    this.from = from;
    this.to = to;
    this.total = total;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function readAll() {
    readTextFile("json/domain.json", function (text) {
        readEntitys(text);
        readRelations(text);
        readSpecial(text)
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
    var finalarray = [];
    finalarray.pop();
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (i != j) {
                if (array[i].to == array[j].to) {
                    if (finalarray.length < array.length / 2) {
                        var bez = new Beziehung(array[i].from, array[j].from, array[i].cardTo, array[j].cardTo);
                        finalarray.push(bez);
                    }
                }
            }
        }

    }
    for (var k = 0; k < finalarray.length; k++) {
        relationArray.push(finalarray[0]);
    }
}

function readEntitys(data) {

    var array = [];
    var mydata = JSON.parse(data);
    var entityarray = mydata.nodeDataArray;
    for (var i = 0; i < entityarray.length; i++) {
        if (entityarray[i].category == "entity") {
            entityArray.push(entityarray[i].entityName);
        }
    }
}

function readSpecial(data) {
    var array = [];
    var mydata = JSON.parse(data);
    var specialarray = mydata.linkDataArray;
    for (var i = 0; i < specialarray.length; i++) {
        if (specialarray[i] !== undefined) {
            if (specialarray[i].category == "specializationLine") {
                var to = specialarray[i].from;
                var connect = specialarray[i].to;
                specialarray[i] = undefined;
                for (var j = 0; j < specialarray.length; j++) {
                    if (specialarray[j] !== undefined) {
                        if (specialarray[j].category == "partialGeneralizationLine" && specialarray[j].to == connect) {
                            array.push(new Specialization(specialarray[j].from, to, false));
                        }
                        if (specialarray[j].category == "totalGeneralizationLine" && specialarray[j].to == connect) {
                            array.push(new Specialization(specialarray[j].from, to, true));
                        }
                    }
                }
            }
        }
    }
    xml = "<xmlSpecial>";
    for (var k = 0; k < array.length; k++) {
        specialArray.push(array[i]);
    }
}