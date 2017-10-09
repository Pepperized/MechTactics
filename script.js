window.onload = init;

function init() {
    var button = document.getElementById("infobutton");
    button.onclick = handleButtonClick;
}



function handleButtonClick() {
    document.getElementById("textbody").scrollIntoView({ behavior: 'smooth', block: "start"});
}
