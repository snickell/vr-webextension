// Open our VR Preview Tab
let tab=null;
browser.tabs.create({
    url: "tab.html"
}).then(function (newTab) {
    tab = newTab;
});
