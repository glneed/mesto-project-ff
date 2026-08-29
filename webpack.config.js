const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src', 'scripts', 'index.js'),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'scripts/[name].[contenthash].js',
      clean: true,
    },

    devServer: {
      static: path.resolve(__dirname, 'dist'),
      open: true,
      port: 8080,
      hot: true,
    },

    devtool: isProduction ? false : 'source-map',

    module: {
      rules: [
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
          exclude: /node_modules/,
          use: { loader: 'babel-loader' },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: { filename: 'images/[name].[hash][ext]' },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name].[hash][ext]' },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
      }),
    ],

    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()],
    },
  };
};