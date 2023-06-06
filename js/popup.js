// Helper functions

// Thanks to EditThisCookie extension for the code and help understanding the Chrome Cookies API in depth
function getUrlVars() {
    var d = [], c;
    var a = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var b = 0; b < a.length; b++) {
        c = a[b].split("=");
        d.push(c[0]);
        d[c[0]] = c[1]
    }
    return d
}

function rawToSet(untransformed) {
    var cookieToSet = {};
    // if untransformed domain is an IP address or after :// have a dot, we need to remove the leading dot


    if (untransformed.domain.substr(0, 1) == '.') {
        untransformed.domain = untransformed.domain.substring(1);
    }

    untransformed.secure = true;
    cookieToSet.url = "https://" + untransformed.domain + "/login/index.php";
    cookieToSet.domain = untransformed.domain;

    cookieToSet.name = untransformed.name;
    cookieToSet.value = untransformed.value;

    cookieToSet.path = untransformed.path;
    cookieToSet.httpOnly = untransformed.httpOnly;
    if (!untransformed.session) {
        cookieToSet.expirationDate = untransformed.expirationDate;
    }
    cookieToSet.storeId = untransformed.storeId;
    //cookieToSet.sameSite = "strict";
    return cookieToSet;
}

function deleteCookie(url, name, store, callback) {
    console.log("Borrando cookie " + name + " con url " + url + "...");
    chrome.cookies.remove({
        'url': "https://aulavirtual.uji.es",
        'name': name,
        'storeId': store
    }, function (details) {
        if (typeof callback === "undefined")
            return;
        if (details === "null" || details === undefined || details === "undefined") {
            callback(false);
        } else {
            callback(true);
        }
    })
}



function addCookie(cookie) {
    chrome.cookies.getAllCookieStores(function (ckSt) {
        for (let x = 0; x < ckSt.length; x++) {
            if (ckSt[x].tabIds.indexOf(currentTabID) != -1) {
                cookie.storeId = ckSt[x].id;
                break;
            }
        }


        // expiration date 1 year from now
        var expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        deleteCookie(cookie.url, cookie.name, cookie.storeId, function () {
            chrome.cookies.set(rawToSet(cookie));
        });
    });
}

function restoreCookies() {


    chrome.storage.local.get(cookiesList, function (data) {

        for (var i = 0; i < cookiesList.length; i++) {
            var cookie = data[cookiesList[i]];
            if (cookie) {
                addCookie(cookie);
            }
        }
    });
}

// Helepr variables
var currentTabID;
var currentTabURL;



function start() {

    var arguments = getUrlVars();
    if (arguments.url === undefined) {
        chrome.tabs.query(
            {
                active: true,
                lastFocusedWindow: true
            },
            function (tabs) {
                let currentTabURL = tabs[0].url;
                currentTabID = tabs[0].id;
            }
        );
    } else {
        var url = decodeURI(arguments.url);
        currentTabID = parseInt(decodeURI(arguments.id));
        document.title = document.title + "-" + url;
    }
}




document.addEventListener("DOMContentLoaded", function () {

    var toggleSwitch = document.getElementById("toggleSwitch");
    var moreInfoButton = document.getElementById("moreInfoButton");
    var statusMessage = document.getElementById("statusMessage");
    var buttonMessage = document.getElementById("buttonMessage");
    var buttonStart = document.getElementById("start");
    var cookiesList = ["MoodleSessionaulavirtualuji", "MDL_SSP_AuthToken", "MDL_SSP_SessID"];
    start();



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




    buttonStart.addEventListener("click", restoreCookies);



    // More info button click toggle cookieContainer
    moreInfoButton.addEventListener("click", function () {
        var cookieContainer = document.getElementById("cookieContainer");
        cookieContainer.classList.toggle("hidden");
    });


});




