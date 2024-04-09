



document.addEventListener("DOMContentLoaded", function () {

    var toggleSwitch = document.getElementById("toggleSwitch");
    var statusMessage = document.getElementById("statusMessage");





 




    $("#config").click(function () {
        window.location.href = "/pages/config/config.html";
    });





    toggleSwitch.addEventListener("change", function () {
        chrome.storage.local.get("configurations", function (data) {
            extensionConfig = data.configurations || [];


            extensionConfig.extensionEnabled = toggleSwitch.checked;
            chrome.storage.local.set({ "configurations": extensionConfig });
    
            buttonMessage.textContent = (toggleSwitch.checked) ? "Activado" : "Desactivado";
            statusMessage.textContent = statusMessageDisplay(extensionConfig.extensionEnabled, extensionConfig.configured );
        });
    });

    // clear configurations
    // chrome.storage.local.clear();

    chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || [];
    
        if (!extensionConfig || extensionConfig.length == 0) {
            extensionConfig = {
                extensionEnabled: false, 
                configured: false,
                username: "",
                page: 1,
                password: "",
                secret: "",
            };
            // Guardamos el array de configuraciones actualizado en el almacenamiento local
            chrome.storage.local.set({ "configurations": extensionConfig });
        }

        // Actualizamos el estado del toggle switch, el texto del botón y el mensaje de estado
        toggleSwitch.checked = extensionConfig.extensionEnabled;
        buttonMessage.textContent = (toggleSwitch.checked) ? "Activado" : "Desactivado";
        statusMessage.textContent = statusMessageDisplay(extensionConfig.extensionEnabled, extensionConfig.configured);
        
        page = extensionConfig.page;
        
        

        if(page == 1){
            window.location.href = "/pages/setup/config1.html";
        }else if(page == 2){
            window.location.href = "/pages/setup/config2.html";
        }else if(page == 3){
            window.location.href = "/pages/setup/config3.html";
        }
    });


});

function statusMessageDisplay(state, configured){
    console.log(state + " " + configured);
    if(state){
        if(configured){
            return "Activada, no tienes que volver a iniciar sesión en el Aula Virtual.";
        }else{
            return "Activada, pero debes configurar la extension por primera vez.";
        }
    }else{
        return "Desactivada, activa la extensión para no volver a tener que iniciar sesión.";
    }

}



