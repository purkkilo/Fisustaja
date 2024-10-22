const webpack = require("webpack");
/*const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
*/
module.exports = {
  outputDir: "../server/public",

  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  transpileDependencies: ["vuetify"],

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
    plugins: [
      //new BundleAnalyzerPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
      }),
    ],
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'fi',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  }
};
