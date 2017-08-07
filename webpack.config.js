var WebpackNotifierPlugin = require('webpack-notifier');
var webpack = require('webpack');

const path = require("path");
// get git info from command line
let commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

module.exports = {
    entry: {
        background: "./src/background.js",
        "vr-browser": "./src/vr-browser/index.js",        
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
    plugins: [
      new WebpackNotifierPlugin({
        contentImage: path.join(__dirname, 'addon/icons/vr-48.png'),
        alwaysNotify: true
      }),
      new webpack.DefinePlugin({
        __GIT_REVISION__: JSON.stringify(commitHash),
      })      
    ],    
};
