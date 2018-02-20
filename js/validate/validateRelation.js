function checkSpace(){
    var name = $('#relationshipName').val();
    var underscore ="_"
    name = name.split(' ').join(underscore);
    $('#relationshipName').val(name);
    console.log(name);
    $('#relationshipName').change();
}