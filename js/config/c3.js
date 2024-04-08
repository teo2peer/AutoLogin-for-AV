$(document).ready(function () {
    $("#captura").click(function () {
        // screenshot del tab with 
        chrome.tabs.captureVisibleTab({format:"jpeg"},function(screenshotDataUrl) {
            
            var imgs, width, height;
            // create img element
            imgs = new Image();
            imgs.src = screenshotDataUrl;
            imgs.onload = function() {
                width = imgs.width;
                height = imgs.height;
            }
            console.log(screenshotDataUrl);
            console.log(width + " " + height);


            // change width and height to int
            const code = jsQR(screenshotDataUrl, width, height);

            

            // append to body
            if (code) {
                $("body").append(code);
            }else{
                $("body").append("QR Code not found");
            }
            
            
            
            
        });

    });

});