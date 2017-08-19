function move(to){
    var alletabjes = document.getElementsByClassName("tabje");
    var alleelemen = document.getElementsByClassName("tabelement");
    for(var i = 0 ; i < alletabjes.length ; i++){
        var tabje = alletabjes[i];
        var elems = alleelemen[i];
        if(elems==to){
            tabje.style.display = "block";
            elems.style.borderLeft = "solid black 1px";
            elems.style.borderRight = "solid black 1px";
            elems.style.borderTop = "solid black 1px";
            elems.style.borderBottom = "none";
            elems.style.backgroundColor = "white";
        }else{
            tabje.style.display = "none";
            elems.style.borderLeft = "none";
            elems.style.borderRight = "none";
            elems.style.borderTop = "none";
            elems.style.borderBottom = "solid black 1px";
            elems.style.backgroundColor = "inherit";
        }
    }
}