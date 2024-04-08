$(document).ready(function () {
    $("#captura").click(function () {
        // screenshot del tab with 
        chrome.tabs.captureVisibleTab({ format: "jpeg" }, async function (screenshotDataUrl) {
            let qrdata="";
            await QrScanner.scanImage(screenshotDataUrl)
                .then(result => 
                    qrdata = result
                )
                .catch(error => 
                    $("#error").show().text("No se ha podido capturar el QR code.")
                );

            // convert to url
            const urlParams = new URL(qrdata);
            const secret = urlParams.searchParams.get("secret");
            const issuer = urlParams.searchParams.get("issuer");

            if(!secret){
                $("#error").show().text("El QR no es válido.");
                return;
            }

            if(issuer){
                // si contiene jaume i
                if(!issuer.includes("Jaume I")){
                    $("#error").show().text("El QR no es de la UJI.");
                    return;
                }
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
            
            window.location.href = "config4.html";
        });

    });

});