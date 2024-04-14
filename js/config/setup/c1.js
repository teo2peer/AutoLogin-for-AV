$(document).ready(function () {
    $("#config2").click(function () {
        // check if in url is web-version
        if (window.location.href.indexOf("web-version") > -1) {
            window.location.href = "/pages/setup/web-version/config2.html";
        } else {
            window.location.href = "/pages/setup/config2.html";
        }
    });
    
});

