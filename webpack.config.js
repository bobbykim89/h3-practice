const path = require("path");
const nodeExternals = require("webpack-node-externals");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    bundle: path.resolve(__dirname, "src/index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "main.js",
    clean: true,
  },
  optimization: {
    minimize: true,
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  plugins: [new BundleAnalyzerPlugin()],
};
