var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
     entry: {
       main: './src/main.js',
       testrpc: './src/testrpc.js'
     },
     output: {
         path: './dist/',
         filename: '[name].bundle.js',
     },
     resolve: {
       extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx', '.json', 'index.json']
     },
     module: {
       preLoaders: [{
         test: /\.json$/,
         loader: 'json'
       }],
       loaders: [{
         test: /\.js$/,
         exclude: /node_modules/,
         loader: 'babel-loader',
         query: {
           presets: ['es2015']
         }
       },
       {
         test: /\.scss$/,
         loaders: ["style", "css", "sass"]
       }]
     },
     devServer: {
       inline: true,
       "Access-Control-Allow-Origin": "*"
     }
 }
