/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: path.join(__dirname, 'src', 'index.ts'),
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    // umdNamedDefine: true,
    // globalObject: "typeof window !== 'undefined' ? window : this"
    library: 'acg',
    auxiliaryComment: 'Test Comment',
  },
};
