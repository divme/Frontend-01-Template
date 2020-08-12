const path = require('path')

module.exports = {
    entry: './main.js',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {
                                    pragma: 'createElement'
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: {
                    loader: path.resolve('./localLoader/cssloader.js')
                }
            },
            {
                test: /\.view$/,
                use: {
                    loader: path.resolve('./localLoader/viewLoader.js')
                }
            }
        ]
    },
    optimization: {
        minimize: false
    }
}