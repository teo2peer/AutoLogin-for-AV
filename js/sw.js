chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {




    if (changeInfo && changeInfo.status === "complete" && tab.url && tab.url.startsWith("https://aulavirtual.uji.es/")) {




        var cookiesList = ["MoodleSessionaulavirtualuji", "MDL_SSP_AuthToken", "MDL_SSP_SessID"];
        for (var i = 0; i < cookiesList.length; i++) {
            chrome.cookies.get({
                url: "https://aulavirtual.uji.es",
                name: cookiesList[i]
            }, function (cookie) {
                if (cookie && tab.url == "https://aulavirtual.uji.es/my/courses.php" && tab.url != "https://aulavirtual.uji.es/login/index.php") {

                    chrome.storage.local.set({ [cookie.name]: cookie }, function () {
                        console.log("Cookie " + cookie.name + " copiada y guardada.");
                    });
                }


            });
        }



        if (tab.url === "https://aulavirtual.uji.es/login/index.php") {

            chrome.storage.local.get("extensionEnabled", function (data) {
                if (data.extensionEnabled != true) {
                    return;
                }


                chrome.storage.local.get("loginAttempt", function (data) {

                    // get local cookie if exist
                    chrome.storage.local.get("copiedCookie", function (cookie) {
                        if (!cookie.copiedCookie) {
                            return;
                        }
                    });




                    if (data.loginAttemptTimes) {
                        var now = new Date();
                        chrome.storage.local.get("loginAttemptTime", function () {
                            if (now - data.loginAttemptTime > 300000) {
                                chrome.storage.local.set({ "loginAttempt": 1 }, function () {
                                    chrome.storage.local.set({ "loginAttemptTime": now }, function () {
                                        // chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
                                    });
                                }
                                );
                            } else {
                                if (data.loginAttempt > 3) {
                                    chrome.storage.local.remove("copiedCookie", function () {
                                        console.log("Cookie borrada.");
                                    });
                                }
                                chrome.storage.local.set({ "loginAttempt": data.loginAttempt + 1 }, function () {
                                    chrome.storage.local.set({ "loginAttemptTime": now }, function () {
                                        // chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
                                    });
                                });
                            }
                        });
                    } else {
                        chrome.storage.local.set({ "loginAttempt": 1 }, function () {
                            var now = new Date();
                            chrome.storage.local.set({ "loginAttemptTime": now }, function () {
                                // chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
                            });
                        });
                    }
                });
            });
        }


    }
});





chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Received %o from %o, frame", request, sender.tab, sender.frameId);

    var cookiesList = ["MoodleSessionaulavirtualuji", "MDL_SSP_AuthToken", "MDL_SSP_SessID"];
    if (request.action === "getCopiedCookie") {
        var json = {}
        var cookie = chrome.storage.local.get(cookiesList);
        Promise.resolve(cookie).then(function (value) {
            sendResponse(value);

        });


        return true;
    }

});
