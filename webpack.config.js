var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    bundle: "app/javascripts/app.js",
    spec_bundle: "./spec/main.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },
  resolve: {
    alias: {
      app: __dirname + '/app',
      views: 'app/javascripts/views',
      utilities: 'app/javascripts/utilities',
      stylesheets: 'app/stylesheets',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Variables become available to all modules.
      $: "jquery",
      jQuery: "jquery",
      _: "underscore"
    }),
  ],
  module: {
    loaders: [
      { test:  /\.s?css$/, loaders: ["style", "css", "sass"] },
      { test:  /\.js$/, loader: "babel", exclude: /node_modules/ }, // Adds ES6 support.
      { test:  /\.json$/, loaders: ["json", "strip-json-comments"] },
    ]
  },
  devtool: 'source-map',
};

if (process.argv.indexOf('--minify') >= 0) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  );
}
