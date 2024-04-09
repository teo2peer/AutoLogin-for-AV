$(document).ready(function () {

    // guardar en local storage
    chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || [];
        sc = extensionConfig.secret;
        username = extensionConfig.username;

        var qrcode = new QRCode("qrcode", {
            text: "otpauth://totp/"+username+"?secret=" + sc + "&issuer=Universitat%20Jaume%20I",
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        $("#sc").val(sc);
    });

    $("#save").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();

        chrome.storage.local.get("configurations", function (data) {
            var extensionConfig = data.configurations || [];
            extensionConfig.username = username;
            extensionConfig.password = (password!= "") ? password : extensionConfig.password;
            chrome.storage.local.set({ "configurations": extensionConfig });
            
            $("#userform").html("<h2 class='mt-2 mb-4 text-center'>Guardado correctamente</h2>");
        });
    });
    
});

