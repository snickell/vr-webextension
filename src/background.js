// Open our VR Preview Tab
let tab=null;
browser.tabs.create({
    url: "reacttab.html"
}).then(function (newTab) {
    tab = newTab;
});
