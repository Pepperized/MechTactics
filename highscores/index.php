<!-- loads the stylesheet for every page -->
<link rel="stylesheet" type="text/css" href="/mainstyle.css"/>
<!-- loads the stylesheet for this page -->
<link rel="stylesheet" type="text/css" href="highscores.css"/>
<script src="jquery.js"></script>
<script src="table.js"></script>

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

<body>
    <div id ="content">
    <!-- top player info, to be made dynamic -->
    <div id="topplayerinfo">
        <span>
            <h1>High Scores</h1>
            <br>
            <h2>Jeff is our current winner with 180 points!</h2>
        </span>
    </div>
    <!-- highscore table, to be made dynamic -->
    <div id="leaderboards">
        <span>
        <h1 style="text-align: center">Leaderboards</h1>
        <table>
            <tr>
                <th>Name</th>
                <th>Score</th>
            </tr>
            <tr>
                <td>Jeff</td>
                <td>180</td>
            </tr>
            <tr>
                <td>Brad</td>
                <td>130</td>
            </tr>
            <tr>
                <td>Alice</td>
                <td>100</td>
            </tr>
            <tr>
                <td>Sam</td>
                <td>90</td>
            </tr>
            <tr>
                <td>Jenny</td>
                <td>70</td>
            </tr>
            <tr>
                <td>Paul</td>
                <td>60</td>
            </tr>
            <tr>
                <td>Joe</td>
                <td>30</td>
            </tr>
            <tr>
                <td>Forest</td>
                <td>0</td>
            </tr>
        </table>
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