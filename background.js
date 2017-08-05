console.log("Loading background.js");


let tab = null;

function createPopup() {      
    browser.tabs.create({
        url: "tab.html"
    }).then((newTab) => {
        tab = newTab;
    });
}

createPopup();

function handleMessage(request, sender, sendResponse) {
    console.log(request);
    browser.tabs.sendMessage(tab.id, request);
}

browser.runtime.onMessage.addListener(handleMessage);

