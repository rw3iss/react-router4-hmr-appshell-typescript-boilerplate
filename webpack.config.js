const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'app');

const config = {
    
    mode: 'development',
    
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/dev-server',
            APP_DIR + '/client.ts'
        ] 
    },

    output: {
        publicPath: '/',
        path: BUILD_DIR,
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
	    alias: {
	      components: path.resolve(__dirname, "app/components"),
	      lib: path.resolve(__dirname, "app/lib"),
	    }
    },

    module: {
        rules: [
            { 
                test: /\.(t|j)sx?$/, 
                include: APP_DIR,
                exclude: /node_modules/,
                loader: ['ts-loader']
            },

            {
                test: /\.scss$/,
                include: APP_DIR,
                exclude: /node_modules/,
                loader: extractSass.extract({
                    use: [
                        // { loader: 'style-loader' }, // probably don't need this? creates styles from js strings
                        { loader: 'css-loader?sourceMap' }, 
                        { loader: 'sass-loader?sourceMap' }
                    ],
                    fallback: 'style-loader'
                })
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        extractSass
    ],

    devServer: {
        hot: true,
        contentBase: './',
        publicPath: '/',
        public: 'http://localhost:3000',
        port: 3000
    }

};

module.exports = config;