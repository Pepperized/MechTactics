<!-- loads the stylesheet for every page -->
<link rel="stylesheet" type="text/css" href="/mainstyle.css">
<!-- loads the stylesheet for this page -->
<link rel="stylesheet" type="text/css" href="register.css">

<!-- outputs the header -->
<?php
    //get the DOCUMENT_ROOT server variable
    $path = $_SERVER['DOCUMENT_ROOT'];
    //append the path of the target php script
    $path .= "/header.php";
    //include it
    include($path);
    outputHeader("Register");
?>

<body>
    <div id="content">
        <form>
            <label for="uname">Username</label>
            <input type="text" id="runame" name="uname" required>
            <label for="pword">Password</label>
            <input type="password" id="rpass" name="pword" required>
            <label for="confirm">Password Confirmation</label>
            <input type="password" id="rconfirm" name="confirm" required>
            <label for="email">E-Mail</label>
            <input type="text" id="remail" name="email" required>
        </form>
        <button class="btnImportant" onclick="Register()">Submit</button>
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