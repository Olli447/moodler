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
    xml = "<xmlRelation>";
    for (var k = 0; k < finalarray.length; k++) {
        xml+="<relation>";
        xml+="<from>"+finalarray[k].from+"</from>";
        xml+="<to>"+finalarray[k].to+"</to>";
        xml+="<cardFrom>"+finalarray[k].cardFrom+"</cardFrom>";
        xml+="<cardTo>"+finalarray[k].cardTo+"</cardTo>";
        xml+="</relation>";
    }
    xml+="</xmlRelation>";
    $('#dataRelation').val(xml);
    console.log($('#dataRelation').val());
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
     xml = "<xmlEntity>";
    for (var i = 0; i < array.length; i++) {
        xml+="<name>"+array[i]+"</name>";
    }
    xml+="</xmlEntity>";
    $('#dataEntity').val(xml);
    console.log($('#dataEntity').val());
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
        xml+="<special>";
        xml+="<from>"+array[k].from+"</from>";
        xml+="<to>"+array[k].to+"</to>";
        xml+="<total>"+array[k].total+"</total>";
        xml+="</special>";
    }
    xml+="</xmlSpecial>";
    $('#dataSpecialization').val(xml);
    console.log($('#dataSpecialization').val());
}