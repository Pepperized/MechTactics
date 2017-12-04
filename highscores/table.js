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
    //add top of table to the table string
    var htmlstring = "<table><tr><th>Name</th><th>Score</th></tr>";
    //for each highscoredata
    for (i=0; i < highscoreData.length; i++) {
        //add a table row
        htmlstring += "<tr><td>" + highscoreData[i].username + "</td><td>" + highscoreData[i].score + "</td></tr>";
    }
    //finishes table tag
    htmlstring += "</table>";
    //gets the div where the table will be inserted
    var tablediv = $('#tablediv');
    //inserts the table
    tablediv.append(htmlstring);
    //gets the leader info h2 tag
    var leaderinfo = $('#leaderinfo');
    //changes the text of the leaderinfo
    leaderinfo.text(highscoreData[0].username + " is our current winner with " + highscoreData[0].score + " points!");
});


