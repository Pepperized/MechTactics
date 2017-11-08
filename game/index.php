<!-- loads the stylesheet for every page -->
<link rel="stylesheet" type="text/css" href="/mainstyle.css"/>
<!-- loads the stylesheet for this page -->
<link rel="stylesheet" type="text/css" href="game.css"/>
<!-- loads the tarrget font for use in the game -->
<link rel="stylesheet" href="font.css" type="text/css" charset="utf-8" />

<!-- outputs the header -->
<?php
    //get the DOCUMENT_ROOT server variable
    $path = $_SERVER['DOCUMENT_ROOT'];
    //append the path of the target php script
    $path .= "/header.php";
    //include it
    include($path);
    outputHeader("Game");
?>

<body>
    <div id="gamediv">
        <!-- game.js inserts canvas here -->
    </div>
    <!-- all scripts for the game in correct load order -->
    <script src="js/phaser.js"></script>
    <script src="js/hexgrid.js"></script>
    <script src="js/mech.js"></script>
    <script src="js/enemy.js"></script>
    <script src="js/fx.js"></script>
    <script src="js/game.js"></script>
</body>

<!-- outputs the footer -->
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