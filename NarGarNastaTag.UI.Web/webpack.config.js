var webpack = require('webpack');
module.exports = {
    entry: {
        home: './Scripts/App/UI/HomePage.ts',
        favorites: './Scripts/App/UI/FavoritesPage.ts',
        routes: './Scripts/App/UI/RoutesPage.ts',
        train: './Scripts/App/UI/TrainPage.ts'
    },
    output: {
        path: __dirname + '/Content/dist/scripts/',
        filename: '[name].page.js',
        publicPath: 'Content/dist'
    },
    externals: {
        "jquery": "$",
        "Q": true
    },
    plugins: [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ]),
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            minChunks: 2
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'Q', 'exports', 'require']
            }
        })
    ],
    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['./bower_components']
    },

    // Add loader for .ts files.
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'typescript-loader'
        }]
    }
};
