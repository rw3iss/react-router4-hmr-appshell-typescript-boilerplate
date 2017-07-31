var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/dev-server',
            //'react-hot-loader/patch',
            APP_DIR + '/entry.tsx'
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
        loaders: [
            { 
                test: /\.(t|j)sx?$/, 
                include: APP_DIR,
                exclude: /node_modules/,
                loader: ['ts-loader']
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
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