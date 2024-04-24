$(document).ready(function () {
    $("#captura").click(function () {
        // screenshot del tab with 
        chrome.tabs.captureVisibleTab({ format: "jpeg" }, async function (screenshotDataUrl) {
            let qrdata = "";
            await QrScanner.scanImage(screenshotDataUrl)
                .then(result =>
                    qrdata = result
                )
                .catch(error =>
                    $("#error").show().text("No se ha podido capturar el QR code. Comprueba que sea https:// y no file:// o otra cosa")
                );

            var secret = null;

            // check if qr data is otpauth-migration
            if (qrdata.includes("otpauth-migration")) {

                await $.ajax({
                    url: "https://teodin.dev/api/apps/gadecoder",
                    type: "POST",
                    data: JSON.stringify({ qrdata: qrdata }),
                    contentType: "application/json",
                    success: function (data) {
                        secret = data.secret;
                    },
                    error: function () {
                        $("#error").show().text("No se ha podido decodificar el QR code. Comprueba tu conexion a internet y intentalo mas tarde.");
                    }
                });
            } else {
                secret = otpauth(qrdata);
            }

            if (!secret) {
                return;
            }

            

            // guardar en local storage
            chrome.storage.local.get("configurations", function (data) {
                var extensionConfig = data.configurations || [];


                // Actualizamos el estado del toggle switch, el texto del botón y el mensaje de estado
                extensionConfig.extensionEnabled = true;
                extensionConfig.configured = true;
                extensionConfig.page = 0;
                extensionConfig.secret = secret;
                console.log(extensionConfig);

                // Guardamos el array de configuraciones actualizado en el almacenamiento local
                chrome.storage.local.set({ "configurations": extensionConfig });
            });

            if (window.location.href.indexOf("web-version") > -1) {
                window.location.href = "/pages/setup/web-version/config4.html";
            } else {
                window.location.href = "/pages/setup/config4.html";
            }
        });

    });

});





function otpauth(qrdata) {
    const urlParams = new URL(qrdata);
    const secret = urlParams.searchParams.get("secret");
    const issuer = urlParams.searchParams.get("issuer");

    if (!secret) {
        $("#error").show().text("El QR no es válido.");
        return null;
    }

    if (issuer) {
        // si contiene jaume i
        if (!issuer.includes("Jaume I")) {
            $("#error").show().text("El QR no es de la UJI.");
            return null;
        }
    }
    return secret;
}