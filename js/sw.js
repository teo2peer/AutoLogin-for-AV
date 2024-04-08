


/**--------------------------------------------
 *               Helper Functions
 *---------------------------------------------**/
/**
 * This function builds a URL
 * @param {String} domain - The domain
 * @param {String} path - The path
 * @param {String} searchUrl - The search URL
 * @returns {String} - Returns the URL
 */
function buildUrl(domain, path, searchUrl) {
    // Keep same protocol as searchUrl
    // This fixes a bug when we want to unset 'secure' property in an https domain
    var secure = searchUrl.indexOf("https://") === 0;

    if (domain.substr(0, 1) === '.')
        domain = domain.substring(1);

    return "https://" + domain + path;
}



function configPage() {
    window.location.href = "config1.html";
}

/**--------------------------------------------
 *               Global Variables
 *---------------------------------------------**/
var currentTabID;
var currentTabURL;



/**
 * This function starts the extension
 * @returns {Void} - Returns nothing
 */
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





/**
 * This function listens for tab updates
 * 
 * @param {Number} tabId - The tab ID
 * @param {Object} changeInfo - The change info object
 * @param {Object} tab - The tab object
 * @returns {Void} - Returns nothing
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    start();

    if (changeInfo && changeInfo.status === "complete" && tab.url && tab.url.startsWith("https://aulavirtual.uji.es/")) {
        

    }


});





/**
 * This function listens for messages from the popup
 * @param {Object} request - The request object
 * @param {Object} sender - The sender object
 * @param {Function} sendResponse - The response function
 * @returns {Boolean} - Returns true if the response is async
 * 
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Received %o from %o, frame", request, sender.tab, sender.frameId);

    if (request.action === "configured") {
        
        return true;

    } else if (request.action === "name2") {
        
        return true;
    } 

});
