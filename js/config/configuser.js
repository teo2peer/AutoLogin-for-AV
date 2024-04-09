$(document).ready(function () {
    // guardar en local storage
    chrome.storage.local.get("configurations", function (data) {
        var extensionConfig = data.configurations || [];
        $("#username").val(extensionConfig.username);
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

