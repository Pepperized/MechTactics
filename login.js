if (!localStorage.usersdata) {
    localStorage.setItem("usersdata", JSON.stringify(new Array()));
}

function Register() {
    var username = document.getElementById("uname").value;
    var password = document.getElementById("pass").value;
     
    var search = false;
    var usersdata = JSON.parse(localStorage.usersdata);
    for (var i=0; i < usersdata.length; i++) {
        if (usersdata[i].username === username) {
            search = true;   
            window.alert("Username taken.");
        }
    }
    var udata = CreateUserData(username, password);
    if (!search) {
        usersdata.push(udata);
        localStorage.setItem("usersdata", JSON.stringify(usersdata));
        window.alert("Registered");
        Login();
    }   
}

function Login() {
    var username = document.getElementById("uname").value;
    var password = document.getElementById("pass").value;
    
    var usersdata = JSON.parse(localStorage.usersdata);
    
    var search = false;
    var index = 0;
    for (var i=0; i < usersdata.length; i++){
        if (usersdata[i].username === username && usersdata[i].password === password) {
            search = true;
            index = i;
        }
    }
    
    if (search) {
        var udata = CreateUserData()
        sessionStorage.setItem("login", JSON.stringify(usersdata[index]));
        window.alert("Login successful");
    }else {
        window.alert("Incorrect username or password");
    }
}

function CreateUserData(username, password) {
    var udata = new Object();
    udata.username = username;
    udata.password = password;
    return udata;
}
