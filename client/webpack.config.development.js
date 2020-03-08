const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const sourceDirectory = path.resolve(__dirname, './src');
const buildDirectory = path.resolve(__dirname, '../wwwroot');
const assetsDirectory = path.resolve(__dirname, './resources');

module.exports = {
  entry: {
    main: path.resolve(sourceDirectory, './Main.tsx'),
  },
  output: {
    filename: '[name].bundle.js',
    path: buildDirectory,
  },
  devtool: 'inline-source-map', //"source-map",
  devServer: {
    contentBase: [buildDirectory, assetsDirectory],
    port: 8888,
    hot: true,
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: ['react-hot-loader/babel'],
            },
          },
          'awesome-typescript-loader',
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      title: 'React-Redux-Scss-Dev',
      template: path.resolve(sourceDirectory, './index.development.html'),
      filename: path.resolve(buildDirectory, './index.html'),
    }),
    new CopyPlugin([
      {
        from: assetsDirectory,
        to: buildDirectory,
      },
    ]),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
