// Open our VR Preview Tab
let tab=null;
browser.tabs.create({
    url: "vr-browser.html"
}).then(function (newTab) {
    tab = newTab;
});
