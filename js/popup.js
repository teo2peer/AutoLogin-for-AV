



document.addEventListener("DOMContentLoaded", function () {

    var toggleSwitch = document.getElementById("toggleSwitch");
    var moreInfoButton = document.getElementById("moreInfoButton");
    var statusMessage = document.getElementById("statusMessage");
    var buttonMessage = document.getElementById("buttonMessage");
    var buttonStart = document.getElementById("start");
    var cookiesList = ["MoodleSessionaulavirtualuji", "MDL_SSP_AuthToken", "MDL_SSP_SessID"];



    toggleSwitch.addEventListener("change", function () {
        buttonMessage.textContent = (toggleSwitch.checked) ? "Activado" : "Desactivado";
        chrome.storage.local.set({ "extensionEnabled": toggleSwitch.checked }, function () {
        });

        if (!toggleSwitch.checked) {
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


    chrome.storage.local.get("extensionEnabled", function (data) {
        toggleSwitch.checked = data.extensionEnabled;

        buttonMessage.textContent = (data.extensionEnabled) ? "Activado" : "Desactivado";

        if (!data.extensionEnabled) {
            statusMessage.textContent = "Desactivada, activa la extensión para no volver a tener que iniciar sesión.";
        } else {

            chrome.runtime.sendMessage({ action: "getCopiedCookie" }, function (response) {
                console.log(response)
                if (!response[cookiesList[0]] || !response[cookiesList[1]] || !response[cookiesList[2]]) {
                    statusMessage.textContent = "Activada, pero debes iniciar sesión por primera vez en el Aula Virtual.";
                } else {
                    statusMessage.textContent = "Activada, no tienes que volver a iniciar sesión en el Aula Virtual.";
                    cookiesList.forEach(element => {
                        var text = document.getElementById(element);
                        text.textContent = response[element].value;
                    });
                }
            });
        }
    });




    // buttonStart.addEventListener("click", restoreCookies);



    // More info button click toggle cookieContainer
    moreInfoButton.addEventListener("click", function () {
        var cookieContainer = document.getElementById("cookieContainer");
        cookieContainer.classList.toggle("hidden");
    });


});




