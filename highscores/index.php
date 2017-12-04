<!-- loads the stylesheet for every page -->
<link rel="stylesheet" type="text/css" href="/mainstyle.css"/>
<!-- loads the stylesheet for this page -->
<link rel="stylesheet" type="text/css" href="highscores.css"/>

<!-- outputs the header -->
<?php
    //get the DOCUMENT_ROOT server variable
    $path = $_SERVER['DOCUMENT_ROOT'];
    //append the path of the target php script
    $path .= "/header.php";
    //include it
    include($path);
    outputHeader("High Scores");
?>

<script src="table.js"></script>

<body>
    <div id ="content">
    <!-- top player info, to be made dynamic -->
    <div id="topplayerinfo">
        <span>
            <h1>High Scores</h1>
            <br>
            <h2 id="leaderinfo">Jeff is our current winner with 180 points!</h2>
        </span>
    </div>
    <!-- highscore table, to be made dynamic -->
    <div id="leaderboards">
        <span>
        <h1 style="text-align: center">Leaderboards</h1> 
            <div id="tablediv"></div>
        </span>
    </div>
    </div>
</body>

<!-- outputs footer -->
<?php
    //get the DOCUMENT_ROOT server variable
    $path = $_SERVER['DOCUMENT_ROOT'];
    //append the path of the target php script
    $path .= "/footer.php";
    //include it
    include($path);
    //output the footer
    outputFooter();
?>