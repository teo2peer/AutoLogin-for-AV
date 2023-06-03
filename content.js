chrome.runtime.sendMessage({ action: "getCopiedCookie" }, function (response) {
    if (response.cookie) {
        copyToClipboard(response.cookie);
        console.log("Cookie copiada al portapapeles.");
    }
});

function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}


chrome.storage.local.get("extensionEnabled", function (data) {

    if (!data.extensionEnabled) {


        if (window.location.href === "https://aulavirtual.uji.es/login/index.php") {
            document.getElementsByClassName("loginform")[0].innerHTML = "<h2>Intentando auto-iniciar sesión...</h2><hr><h5>Si se recarga durante mas de 5 veces, desactiva la extension, inicia sesion y vuelve a activarla</h5><p> Auto UJI login by Teo2Peer</p>";
        }
    }
});

