function checkCardi(element) {
    var b = true;
    if (element.val().charAt(2)!= '*') {
    var lower = parseInt(element.val().charAt(0));
    var higher = parseInt(element.val().charAt(2));
    if(lower>higher){
        element.val("");
        b=false;
        $('#clickModalCardinal').click();
    }
}
    return b;
}