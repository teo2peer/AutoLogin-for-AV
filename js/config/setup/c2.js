$(document).ready(function () {

    $("#config2").click(async function () {
        // validar regex para que solo se permitan letras y números
        var username = $("#username").val();
        var password = $("#password").val();

        if (username.length < 8 || username.length > 10) {
            showErrorMessage("El nombre de usuario debe tener entre 8 y 10 caracteres");
            return;
        }

        if (password.length < 6) {
            showErrorMessage("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        // rejex username alXXXXXX donde X es un número
        var usernameRegex = /^al\d{6}$/;

        if (!usernameRegex.test(username)) {
            showErrorMessage("El nombre de usuario debe ser alXXXXXX donde X es un número");
            return;
        }

        $(this).attr("disabled", true);

        // Guardamos los datos en el almacenamiento local y redirigimos a la siguiente página
        await saveData(username, password).then(() => {
            if (window.location.href.indexOf("web-version") > -1) {
                window.location.href = "/pages/setup/web-version/config3.html";
            } else {
                window.location.href = "/pages/setup/config3.html";
            }
        })




    });




    function showErrorMessage(message) {
        $("#error").show();
        $("#error").text(message);
    }
});


async function saveData(username, password) {
    // guardar en local storage
    await chrome.storage.local.get("configurations").then(async (data) => {
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
        await chrome.storage.local.set({ "configurations": extensionConfig });
    })

}

