$(document).ready(function () {

    $("#config2").click(async function () {
        // validar regex para que solo se permitan letras y números
        var username = $("#username").val();
        var password = $("#password").val();

        if(username.length < 8 || username.length > 10){
            showErrorMessage("El nombre de usuario debe tener entre 8 y 10 caracteres");
            return;
        }

        if(password.length < 6){
            showErrorMessage("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        
        // rejex username alXXXXXX donde X es un número
        var usernameRegex = /^al\d{6}$/;

        if(!usernameRegex.test(username)){
            showErrorMessage("El nombre de usuario debe ser alXXXXXX donde X es un número");
            return;
        }
        
        await saveData(username, password);

        if(!await checkDataSaved()){
            await saveData(username, password);
        }

        

        // delay function porque a veces no de da tiempo a guardar los datos, async va raro
        setTimeout(function () {
            if (window.location.href.indexOf("web-version") > -1) {
                window.location.href = "/pages/setup/web-version/config3.html";
            } else {
                window.location.href = "/pages/setup/config3.html";
            }
        }, 200);
        
    });
        
        


    function showErrorMessage(message){
        $("#error").show();
        $("#error").text(message);
    }
}); 


async function saveData(username, password){
    console.log("Guardando datos");
    // guardar en local storage
    await chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || [];
    
        if (!extensionConfig || extensionConfig.length == 0) {
            extensionConfig = {
                extensionEnabled: false, 
                configured: false,
                page: "",
                username: "",
                password: "",
                secret: "",
            };
        }
        console.log(extensionConfig);

        // Actualizamos el estado del toggle switch, el texto del botón y el mensaje de estado
        extensionConfig.extensionEnabled = true;
        extensionConfig.configured = true;
        extensionConfig.username = username;
        extensionConfig.password = password;
        extensionConfig.page = 3;
        extensionConfig.secret = "";
    
        // Guardamos el array de configuraciones actualizado en el almacenamiento local
        console.log("Datos guardados" + extensionConfig);
    });
}

async function checkDataSaved(){
    var saved = false;
    await chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || [];
    
        if (!extensionConfig || extensionConfig.length == 0) {
            saved = false;
        }else{
            saved = true;
        }
    });

    return saved;
}