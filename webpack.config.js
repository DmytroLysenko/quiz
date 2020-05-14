const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = {
  SRC_DIR: path.join(__dirname, "./src"),
  BUILD_DIR: path.join(__dirname, "./build"),
};

module.exports = {
  entry: "./src/index.js",
  output: {
    path: paths.BUILD_DIR,
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "Quiz",
    }),
  ],
  devServer: {
    contentBase: paths.BUILD_DIR,
    compress: true,
    port: 4040,
  },
};
