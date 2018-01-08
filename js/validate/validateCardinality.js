function checkCardi(element) {
    var b = true;
    if (element.val().charAt(2)!= '*') {
    var lower = parseInt(element.val().charAt(0));
    var higher = parseInt(element.val().charAt(2));
    if(lower>higher){
        element.val("");
        b=false;
        toastr.error("Ihr Min-Wert der Kardinalität darf nicht größer sein, als der Max-Wert.");
    }
}
    return b;
}