<link rel="stylesheet" type="text/css" href="/mainstyle.css"/>
<link rel="stylesheet" type="text/css" href="game.css"/>
<link rel="stylesheet" href="font.css" type="text/css" charset="utf-8" />

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
    <div></div>
    
    <script src="js/phaser.js"></script>
    <script src="js/hexgrid.js"></script>
    <script src="js/mech.js"></script>
    <script src="js/enemy.js"></script>
    <script src="js/fx.js"></script>
    <script src="js/game.js"></script>
</body>

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