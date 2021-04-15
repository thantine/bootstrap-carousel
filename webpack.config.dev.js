const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: ["./src/js/script.js"],
    output: { 
        path: __dirname + "/dist/js",
        filename: 'script.js' 
    },
    devtool: "sourcemap",
    externals: {
        "jquery": "jQuery"
    },    
    module: {   
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    }
}
