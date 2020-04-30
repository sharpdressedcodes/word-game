const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

process.traceDeprecation = true;

const defaultConfig = {
    bail: true,
    cache: false,
    devtool: production ? false : 'eval-source-map',
    context: `${__dirname}/`,
    entry: ['@babel/polyfill'],
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            /*
                ensure there is only one instance of react when resolving modules
                this helps with symlinks
            */
            react: path.join(__dirname, 'node_modules/react'),
            'react-dom': path.join(__dirname, 'node_modules/react-dom')
        }
    },
    watchOptions: {
        aggregateTimeout: 600,
        poll: 1000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            // '@babel/preset-react'
                        ],
                        plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]]
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            plugins: () => [
                                autoprefixer({})
                            ]
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            outputStyle: 'compressed'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `bundle.css`
        }),
    ]
};

if (production) {
    const uglifyPlugin = new UglifyJsPlugin({
        sourceMap: false,
        parallel: true,
        uglifyOptions: {
            beautify: false,
            mangle: false,
            compress: false
        }
    });

    const definePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    });

    defaultConfig.plugins.push(uglifyPlugin);
    defaultConfig.plugins.push(definePlugin);
}

const browserConfig = {
    ...defaultConfig,
    entry: [...defaultConfig.entry, './src/browser/index.js', './src/browser/scss/main.scss'],
    output: {
        ...defaultConfig.output,
        filename: 'bundle.js',
    },
    plugins: [
        ...defaultConfig.plugins,
        new webpack.DefinePlugin({
            __isBrowser__: "true"
        })
    ]
};

const serverConfig = {
    ...defaultConfig,
    entry: [...defaultConfig.entry, './src/server/index.js'],
    target: 'node',
    externals: [nodeExternals({
        // whitelist: ['react-toastify/dist/ReactToastify.css']
    })],
    output: {
        ...defaultConfig.output,
        filename: 'server.js',
    },
    plugins: [
        ...defaultConfig.plugins,
        new webpack.DefinePlugin({
            __isBrowser__: "false"
        })
    ]
};

module.exports = [
    serverConfig,
    browserConfig
];
