module.exports = {
    entry: './static/scripts/app.js',
    output: {
        path: __dirname + '/static/scripts/dist',
        filename: 'tag.net.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'postcss-loader'
        }]
    }
};
