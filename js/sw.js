// Helper functions

// Thanks to EditThisCookie extension for the code and help understanding the Chrome Cookies API in depth
function buildUrl(domain, path, searchUrl) {
    // Keep same protocol as searchUrl
    // This fixes a bug when we want to unset 'secure' property in an https domain
    var secure = searchUrl.indexOf("https://") === 0;

    if (domain.substr(0, 1) === '.')
        domain = domain.substring(1);

    return "https://" + domain + path;
}

function rawToSet(untransformed) {
    var cookieToSet = {};

    untransformed.secure = true;
    cookieToSet.url = buildUrl(untransformed.domain, untransformed.path, "https://" + untransformed.domain + "/login/index.php");


    if (untransformed.domain.substr(0, 1) === '.')
        untransformed.domain = untransformed.domain.substring(1);

    // cookieToSet.domain = untransformed.domain;

    cookieToSet.name = untransformed.name;
    cookieToSet.value = untransformed.value;

    cookieToSet.path = untransformed.path;
    cookieToSet.httpOnly = untransformed.httpOnly;
    if (!untransformed.session) {
        cookieToSet.expirationDate = untransformed.expirationDate;
    }
    cookieToSet.storeId = untransformed.storeId;
    //cookieToSet.sameSite = "strict";
    return cookieToSet;
}

function deleteCookie(url, name, store, callback) {
    console.log("Borrando cookie " + name + " con url " + url + "...");
    chrome.cookies.remove({
        'url': "https://aulavirtual.uji.es",
        'name': name,
        'storeId': store
    }, function (details) {
        if (typeof callback === "undefined")
            return;
        if (details === "null" || details === undefined || details === "undefined") {
            callback(false);
        } else {
            callback(true);
        }
    })
}



function addCookie(cookie) {
    chrome.cookies.getAllCookieStores(function (ckSt) {
        for (let x = 0; x < ckSt.length; x++) {
            if (ckSt[x].tabIds.indexOf(currentTabID) != -1) {
                cookie.storeId = ckSt[x].id;
                break;
            }
        }


        // expiration date 1 year from now
        var expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        deleteCookie(cookie.url, cookie.name, cookie.storeId, function () {
            chrome.cookies.set(rawToSet(cookie));
        });
    });
}

function restoreCookies() {


    chrome.storage.local.get(cookiesList, function (data) {

        for (var i = 0; i < cookiesList.length; i++) {
            var cookie = data[cookiesList[i]];
            if (cookie) {
                addCookie(cookie);
            }
        }
    });

}

// Helepr variables
var currentTabID;
var currentTabURL;
var cookiesList = ["MoodleSessionaulavirtualuji", "MDL_SSP_AuthToken", "MDL_SSP_SessID"];




function start() {


    chrome.tabs.query(
        {
            active: true,
            lastFocusedWindow: true
        },
        function (tabs) {
            let currentTabURL = tabs[0].url;
            currentTabID = tabs[0].id;
        }
    );

}





chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    start();

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
    } else if (request.action === "restoreCookies") {
        restoreCookies();
        sendResponse({ "status": "success" });

        return true;
    } else if (request.action === "cookiesExist") {
        // check if all cookies exist
        var cookiesExist = true;
        for (var i = 0; i < cookiesList.length; i++) {
            chrome.cookies.get({
                url: "https://aulavirtual.uji.es",
                name: cookiesList[i]
            }, function (cookie) {
                if (!cookie) {
                    cookiesExist = false;
                }
            });
        }
        sendResponse({ "status": cookiesExist });
        return true;
    }

});
