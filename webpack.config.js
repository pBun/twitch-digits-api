var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './public_src/index.jsx',
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: '/public/',
        filename: 'app.js'
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                loaders: 'babel-loader',
                exclude: /(node_modules|public\/)/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: true } },
                    { loader: 'css-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    },
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({ filename: './public_src/index.html' })
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
