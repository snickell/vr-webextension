// Open our VR Preview Tab
let tab=null;
browser.tabs.create({
    url: "reacttabs.html"
}).then(function (newTab) {
    tab = newTab;
});
