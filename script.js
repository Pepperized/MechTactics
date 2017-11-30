//subscribes to onload event
window.onload = init;

//onload
function init() {
    //when the button is clicked do handleButtonClick function
    var button = document.getElementById("infobutton");
    button.onclick = handleButtonClick;
}


//onclick
function handleButtonClick() {
    //smooth scrolling
    document.getElementById("textbody").scrollIntoView({ behavior: 'smooth', block: "start"});
}
