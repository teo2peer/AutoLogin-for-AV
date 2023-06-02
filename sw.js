chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {


    if (changeInfo && changeInfo.status === "complete" && tab.url && tab.url.startsWith("https://aulavirtual.uji.es/")) {





        chrome.cookies.get({
            url: "https://aulavirtual.uji.es",
            name: "MoodleSessionaulavirtualuji"
        }, function (cookie) {
            if (cookie) {
                chrome.storage.local.set({ "copiedCookie": cookie.value }, function () {
                    console.log("Cookie copiada y guardada.");
                });
            } else {
                chrome.storage.local.get("copiedCookie", function (data) {
                    if (data.copiedCookie) {
                        chrome.cookies.set({
                            url: "https://aulavirtual.uji.es",
                            name: "MoodleSessionaulavirtualuji",
                            value: data.copiedCookie,
                            secure: true,
                            httpOnly: true
                        }, function (newCookie) {
                            console.log("Cookie restaurada.");
                        });
                    }
                });
            }
        });


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
                                        chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
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
                                        chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
                                    });
                                });
                            }
                        });
                    } else {
                        chrome.storage.local.set({ "loginAttempt": 1 }, function () {
                            var now = new Date();
                            chrome.storage.local.set({ "loginAttemptTime": now }, function () {
                                chrome.tabs.update(tabId, { url: "https://aulavirtual.uji.es/auth/saml2/login.php?wants=https%3A%2F%2Faulavirtual.uji.es%2Fmy%2Fcourses.php&passive=off" });
                            });
                        });
                    }
                });
            });
        }


    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getCopiedCookie") {
        chrome.storage.local.get("copiedCookie", function (data) {
            (data) ? sendResponse({ cookie: data.copiedCookie }) : sendResponse({ cookie: null });
        });
        return true;
    }
});
