function checkCardi(element) {

    if (!semanticSupportEnabled) {
        return;
    }
    var inhalt = element.val();
    var b = true;
    var lower = inhalt.substring(0, inhalt.indexOf(","));
    var higher = inhalt.substring(inhalt.indexOf(",")+1, inhalt.length);

    if(higher=="*"){
        b= true;
        return b;
    }else{
        lNumber= parseInt(lower);
        hNumber = parseInt(higher);
        if(lNumber>hNumber){
            b= false;
            notification.createError("Fehler", "Ihr Min-Wert der Kardinalität darf nicht größer sein, als der Max-Wert.", $('#relationshipName').val());
        }
    }
    return b;
}

function validCardiForm(){
    var b = true;
    if($('#relationshipName').val()==("") || $('#entity1').val()==("") || $('#entity2').val()==("") ||
        $('#cardinality2').val()==("") || $('#cardinality1').val()==("")) {
        b=false;
    }
    return b;
}