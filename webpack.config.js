const path = require("path");

module.exports = {
    entry: {
        background: "./src/background.js",
        tab: "./src/tab.js",
        content: "./src/content.js",
    },
    output: {
        path: path.resolve(__dirname, "addon/build"),
        filename: "[name]/index.js"
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
      ]
    }    
};
