const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()],
  },
  outputDir: "J:\\Fisustaja\\JSVersion\\FisuJS\\server\\public",
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
        contextRegExp: /moment$/,
      }),
    ],
  },
};
