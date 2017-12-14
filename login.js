//required for jquery
window.jQuery = window.$ = jQuery;

//if localstorage.usersdata doesn't exist
if (!localStorage.usersdata) {
    //make an empty array and store it as usersdata
    localStorage.setItem("usersdata", JSON.stringify(new Array()));
}
//when register button is pressed
function Register() {
    //get the various fields
    var text = $('.validtxt');
    text.remove();
    var username = document.getElementById("runame").value;
    var password = document.getElementById("rpass").value;
    var passconfirm = document.getElementById("rconfirm").value;
    var email = document.getElementById("remail").value;
    var phonenumber = document.getElementById("rphonenum").value;
    //validation bool
    var validationFailed = false;
    //get usersdata
    var usersdata = JSON.parse(localStorage.usersdata);
    //check if username or email has been used
    for (var i=0; i < usersdata.length; i++) {
        if (usersdata[i].username === username) {
            validationFailed = true;   
            $("<p class='validtxt'>Username Taken</p>").insertAfter("#runame");
        } if (usersdata[i].email === email) {
            validationFailed = true;   
            $("<p class='validtxt'>Email Taken</p>").insertAfter("#remail");
        }
    }
    //check if passwords match
    if (passconfirm !== password) {validationFailed = true; $("<p class='validtxt'>Password does not match.</p>").insertAfter("#rpass");}
    //check if email is valid
    if (!ValidateEmail(email)) {validationFailed = true; $("<p class='validtxt'>Email not valid.</p>").insertAfter("#remail");}
    //check of phone number is a number
    if (isNaN(phonenumber)) {validationFailed = true; $("<p class='validtxt'>Phone number not valid.</p>").insertAfter("#rphonenum");}
    //create a new udata object
    var udata = CreateUserData(username, password, email, phonenumber);
    //if validation was successful
    if (!validationFailed) {
        //add this udata to usersdata
        usersdata.push(udata);
        //store on localstorage
        localStorage.setItem("usersdata", JSON.stringify(usersdata));
        window.alert("Registered");
    }   
}

//when login button is pressed
function Login() {
    //get the fields
    var username = document.getElementById("uname").value;
    var password = document.getElementById("pass").value;
    //get the usersdata
    var usersdata = JSON.parse(localStorage.usersdata);
    //success bool
    var search = false;
    //index of success
    var index = 0;
    //find a udata with matching username and password
    for (var i=0; i < usersdata.length; i++){
        if (usersdata[i].username === username && usersdata[i].password === password) {
            search = true;
            index = i;
        }
    }
    //if the search was successful
    if (search) {
        //set the login item in sessionstorage to the udata
        sessionStorage.setItem("login", JSON.stringify(usersdata[index]));
        window.alert("Login successful");
    }else {
        //if not then display error
        window.alert("Incorrect username or password");
    }
}
//Returns a userdata object with the given fields
function CreateUserData(username, password, email, phonenumber) {
    var udata = new Object();
    udata.username = username;
    udata.password = password;
    udata.email = email;
    udata.phonenumber = phonenumber;
    return udata;
}

//Found online
function ValidateEmail(mail)   
{  
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
    {  
        return true;
    }  
    
    return false;  
}