var path = require('path');

module.exports = {
    entry: [
        './src/index.js',
        './src/style/style.scss'
    ],
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader?sourceMap!sass-loader?sourceMap'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src')
    }
};