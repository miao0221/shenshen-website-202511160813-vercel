const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: './src/main.js',
        
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            clean: true,
            publicPath: '/'
        },
        
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            compress: true,
            port: 3000,
            historyApiFallback: {
                index: '/index.html'
            },
            open: true
        },
        
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource'
                }
            ]
        },
        
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html'
            })
        ],
        
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        
        devtool: isProduction ? 'source-map' : 'eval-source-map'
    };
};