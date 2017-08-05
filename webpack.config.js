const path = require("path");

module.exports = {
    entry: {
        background: "./background.js",
        tab: "./tab.js",
        content: "./content.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    }
};
