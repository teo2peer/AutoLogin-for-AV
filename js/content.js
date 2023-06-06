

function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}




chrome.storage.local.get("extensionEnabled", function (data) {

    if (data.extensionEnabled == true) {

        if (document.getElementById("loginerrormessage") != null) {

            var div = document.getElementsByClassName("loginform")[0].getElementsByTagName("div")[1];
            if (div != null) {
                div.innerHTML = "Desgraciadamente las cookies han caducado, te tocara volver a iniciar sesión normalmente...";
            }
        } else {
            (async () => {
                const response = await chrome.runtime.sendMessage({ action: "cookiesExist" });
                if (response.status == false) {
                    var button = document.createElement("buton");
                    button.setAttribute("class", "btn login-identityprovider-btn btn-block");
                    button.innerHTML = "<img src=\"https://raw.githubusercontent.com/teo2peer/Auto-AulaVirtual-Login/main/img/icon32.png\" alt=\"\" style=\"width: auto;  height: auto;\">No hay cookies pre-guardadas. Inicia sesión normalmente para guardarlos.";

                    var div = document.getElementsByClassName("login-identityproviders")[0];
                    var h2 = div.getElementsByTagName("a")[0];
                    div.insertBefore(button, h2);
                    return;
                }
            })();


            if (window.location.href.indexOf("https://aulavirtual.uji.es/login/index.php") != -1) {

                var button = document.createElement("a");
                button.setAttribute("class", "btn login-identityprovider-btn btn-block");
                button.addEventListener("click", setCookiesToLogin);
                button.innerHTML = "<img src=\"https://raw.githubusercontent.com/teo2peer/Auto-AulaVirtual-Login/main/img/icon32.png\" alt=\"\" style=\"width: auto;  height: auto;\">Inicia sesión automáticamente con Auto UJI by Teo2Peer";

                var div = document.getElementsByClassName("login-identityproviders")[0];
                var h2 = div.getElementsByTagName("a")[0];
                div.insertBefore(button, h2);
            }
        }
    }
});

function setCookiesToLogin() {
    (async () => {
        const response = await chrome.runtime.sendMessage({ action: "restoreCookies" });
        if (response.status == "success") {
            // wait 2 seconds to login
            var div = document.getElementsByClassName("loginform")[0];
            div.innerHTML = "<h2>AutoUji by Teo2Peer</h2><hr><h4>Redirigiendo al Aula Virtual...</h4> <br><div id=\"wrap\"></div><br><br><p>En caso de no funcionar recargue la  pagina</p> ";
            setTimeout(function () {

                window.location.href = "https://aulavirtual.uji.es/my/courses.php";
            }, 2000);
            console.log(response);
        }
    })();
}

