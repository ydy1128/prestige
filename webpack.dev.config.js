var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './src/index.js',
        'webpack-dev-server/client?http://0.0.0.0:2828',
        'webpack/hot/only-dev-server',
        './src/style/style.scss'
    ],
    output: {
        path: '/',
        filename: 'bundle.js',
    },
    devServer: {
        filename: 'bundle.js',
        publicPath: '/',
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            "**": "http://localhost:2929"
        },
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot-loader', 'babel-loader?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader?sourceMap!sass-loader?sourceMap',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        //alias: {'/': path.resolve('./src')},
        modules: [path.join(__dirname, 'src') , 'node_modules']
    }
};
