document.addEventListener("DOMContentLoaded", function () {
    var toggleSwitch = document.getElementById("toggleSwitch");
    var statusMessage = document.getElementById("statusMessage");

    $("#config").click(function () {
        window.location.href = "/pages/config/config.html";
    });

    toggleSwitch.addEventListener("change", function () {
        chrome.storage.local.get("configurations", function (data) {
            var extensionConfig = data.configurations || [];
            extensionConfig.extensionEnabled = toggleSwitch.checked;
            chrome.storage.local.set({ "configurations": extensionConfig });

            buttonMessage.textContent = toggleSwitch.checked ? "Activado" : "Desactivado";
            statusMessage.textContent = statusMessageDisplay(extensionConfig.extensionEnabled, extensionConfig.configured);
        });
    });

    chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || {
            extensionEnabled: false,
            configured: false,
            username: "",
            page: 1,
            password: "",
            secret: "",
        };

        chrome.storage.local.set({ "configurations": extensionConfig });

        toggleSwitch.checked = extensionConfig.extensionEnabled;
        buttonMessage.textContent = toggleSwitch.checked ? "Activado" : "Desactivado";
        statusMessage.textContent = statusMessageDisplay(extensionConfig.extensionEnabled, extensionConfig.configured);

        var page = extensionConfig.page;

        if (page >= 1 && page <= 3) {
            window.location.href = `/pages/setup/config${page}.html`;
        }
    });
});

function statusMessageDisplay(state, configured) {
    if (state) {
        return configured ? "Activada, no tienes que volver a iniciar sesión en el Aula Virtual." : "Activada, pero debes configurar la extension por primera vez.";
    } else {
        return "Desactivada, activa la extensión para no volver a tener que iniciar sesión.";
    }
}
