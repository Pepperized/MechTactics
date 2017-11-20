window.jQuery = window.$ = jQuery;

var highscoreData = JSON.parse(localStorage.highscores);

highscoreData.sort(function(a,b){
    return b.score - a.score;
})


$( document ).ready(function() {
    console.log(highscoreData[0]);
    var trs = $('tr');
    for (i=0; i < highscoreData.length; i++) {
        if (i+1 < trs.length) {
            var tr = $(trs[i+1]);
            var tds = tr.children('td');
            tds[0].innerHTML = highscoreData[i].username;
            tds[1].innerHTML = highscoreData[i].score;
        }
    }
});


