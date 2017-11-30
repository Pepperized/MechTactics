//required for jQuery
window.jQuery = window.$ = jQuery;

//loads highscores data from localstorage
var highscoreData = JSON.parse(localStorage.highscores);

//adds a sort function for the array
highscoreData.sort(function(a,b){
    return b.score - a.score;
})

//when the document is ready
$( document ).ready(function() {
    //find all table rows
    var trs = $('tr');
    //for each highscoredata
    for (i=0; i < highscoreData.length; i++) {
        //if there are enough table rows
        if (i+1 < trs.length) {
            //capture that row
            var tr = $(trs[i+1]);
            //find the table data
            var tds = tr.children('td');
            //set the inner HTML of one to the username
            tds[0].innerHTML = highscoreData[i].username;
            //set the other to the score
            tds[1].innerHTML = highscoreData[i].score;
        }
    }
});


