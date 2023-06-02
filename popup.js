document.addEventListener("DOMContentLoaded", function () {
    var toggleSwitch = document.getElementById("toggleSwitch");
    var cookieText = document.getElementById("cookieText");
    var statusMessage = document.getElementById("statusMessage");
    var buttonMessage = document.getElementById("buttonMessage");



    toggleSwitch.addEventListener("change", function () {
        buttonMessage.textContent = (toggleSwitch.checked) ? "Activado" : "Desactivado";
        chrome.storage.local.set({ "extensionEnabled": toggleSwitch.checked }, function () {
        });
    });


    chrome.storage.local.get("extensionEnabled", function (data) {
        toggleSwitch.checked = data.extensionEnabled;
        console.log(data.extensionEnabled);
        buttonMessage.textContent = (data.extensionEnabled) ? "Activado" : "Desactivado";

        if (!data.extensionEnabled) {
            statusMessage.textContent = "Desactivada, activa la extensión para no volver a tener que iniciar sesión.";
        } else {
            chrome.storage.local.get("copiedCookie", function (cookie) {
                if (!cookie.copiedCookie) {
                    statusMessage.textContent = "Activada, pero debes iniciar sesión por primera vez en el Aula Virtual.";
                } else {
                    statusMessage.textContent = "Activada, no tienes que volver a iniciar sesión en el Aula Virtual.";
                }
            });
        }
    });




});
