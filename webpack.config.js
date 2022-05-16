const path = require( "path" );
const root = path.resolve( __dirname );
const source = path.join( root, "source" );
const config = require( "./clutch.config" );
const nodeModules = "node_modules";
const BrowserSyncPlugin = require( "browser-sync-webpack-plugin" );
const ESLintWebpackPlugin = require('eslint-webpack-plugin');



const webpackConfig = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",


    devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",


    plugins: [
        new BrowserSyncPlugin({
            open: true,
            host: "localhost",
            port: config.express.port,
            proxy: `http://localhost:${config.express.port}`,
            files: [
                "template/**/*.html",
            ],
        }),
        new ESLintWebpackPlugin(),
    ],


    resolve: {
        modules: [root, source, nodeModules],
        mainFields: ["webpack", "browserify", "web", "clutch", "hobo", "main"]
    },


    entry: {
        "clutch": path.resolve( __dirname, "source/js/app.js" )
    },


    output: {
        path: path.resolve( __dirname, "static/js" ),
        filename: "app.js"
    },


    module: {
        rules: [
            {
                test: /source\/js\/.*\.js$|node_modules\/[properjs-|konami-|paramalama].*/i,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                ],
            },
            {
                test: /\.(sass|scss)$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "resolve-url-loader",
                        options: {
                            root: path.resolve( __dirname, "static" ),
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    "svg-inline-loader",
                ],
            },
        ],
    },
};



module.exports = webpackConfig;
