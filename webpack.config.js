const path = require("path");

module.exports = {
    entry: {
        background: "./src/background.js",
        tab: "./src/tab.js",
        reacttabs: "./src/reacttabs/index.js",        
        content: "./src/content.js",
    },
    output: {
        path: path.resolve(__dirname, "addon/build"),
        filename: "[name]/index.js"
    },
    devtool: "source-map",
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    }, 
};
