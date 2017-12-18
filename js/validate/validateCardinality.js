function checkCardi(lower,higher){
   var b = true;
    if(lower==0 && higher ==0){
        b= false;
    }
    else if(lower>higher){
        b=false;
    }
    return b;
}