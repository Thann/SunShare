var webpack = require('webpack');

module.exports = {
  context: __dirname + "/app/javascripts",
  entry: "./app.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      views: __dirname + '/app/javascripts/views',
      utilities: __dirname + '/app/javascripts/utilities',
      stylesheets: __dirname + '/app/stylesheets',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      _: "underscore"
    }),
  ],
  module: {
    loaders: [
      { test:  /\.s?css$/, loaders: ["style", "css", "sass"] },
      { test:  /\.js$/, loader: "babel-loader", exclude: /node_modules/ }, // Adds ES6 support.
    ]
  },
  devtool: 'source-map',
};

if (process.argv.indexOf('--minify') >= 0) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  );
}
