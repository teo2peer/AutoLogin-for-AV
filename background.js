chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.local.get("extensionEnabled", function (data) {
        if (!data.extensionEnabled) {
            return;
        }
    });
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
