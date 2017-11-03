module.exports = {
  entry: "./main.js",
  node: {fs: "empty"},
  output: {
    path: __dirname,
    filename: "bundle.js"
  }
};
