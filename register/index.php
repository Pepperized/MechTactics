<!-- loads the stylesheet for every page -->
<link rel="stylesheet" type="text/css" href="/mainstyle.css">

<!-- outputs the header -->
<?php
    //get the DOCUMENT_ROOT server variable
    $path = $_SERVER['DOCUMENT_ROOT'];
    //append the path of the target php script
    $path .= "/header.php";
    //include it
    include($path);
    outputHeader("Home");
?>

<body>
    <div id="content">
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