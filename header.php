
<?php
//Stores all onclick parameters, to avoid nested quotes
$linkActions = array(
				"Home" => "window.location.href='/'", 
				"Game" => "window.location.href='/game/'",
				"How to Play" => "window.location.href='/howtoplay/'",
				"High Scores" => "window.location.href='/highscores/'"
				
				);
//This function outputs the header
function outputHeader($currentPage) {
    echo '<!DOCTYPE HTML>';
    echo '<html lang="en">';
    echo '<head>';
    echo '<meta charset="UTF-8">';
    echo '<title>Watchtower Studios</title>';
    echo '<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">';
    echo '<div id="navbar">';
    echo '<section class="navsection" id="navbtnsection">';
    createNavigationButton($currentPage, "Home");
	createNavigationButton($currentPage, "How to Play");
	createNavigationButton($currentPage, "Game");
	createNavigationButton($currentPage, "High Scores");
    echo '</section>';
    echo '<section class="navsection" id="titlesection">';
    echo '<h1 id="maintitle">Watchtower Studios</h1>';
    echo '</section>';
    echo '<section class="navsection" id="loginsection">';
    echo '<section id="logincontent">';
    echo '<input type="text" id="uname" name="username" placeholder="Username">';
    echo '<input type="password" id="pass" name="password" placeholder="Password">';
    echo '<button class="btnImportant">Login</button>';
    echo '<button class="btnNormal">Register</button>';
    echo '</section>';
    echo '</section>';
    echo '</div>';
    echo '</head>';
} 
//This function echos fully built button with correct link and class
function createNavigationButton($currentPage, $targetPage) {
	global $linkActions;
	echo '<button ' .
    buttonType($currentPage, $targetPage) .
    "onclick=$linkActions[$targetPage]>$targetPage</button>";
}	

//This function returns the a different class for the button if it links to the current page
function buttonType($currentPage, $button){
    if($currentPage == $button) {
        return 'class="btnImportant"';
    } else {
        return 'class="btnNormal"';
    }
}