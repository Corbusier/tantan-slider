const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		module: './src/exportModule.js',
		build: './src/main.js'
	},
	output: {
		path: __dirname + '/dist/',
		filename: '[name].js',
		library: 'tantanStack'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
        		loader: 'vue-loader',
			},
			{
				test: /\.css$/,
				loader: ['style-loader','css-loader']
			},
			{
				test: /\.(png|jpg|gif)/,
				use:[{
					loader: 'url-loader',
					options: {
						limit: 500000
					}
				}]
			},
			{
				test: /\.html$/,
				use: [{
					loader: 'html-loader'
				}]
			}
		]
	},
	resolve:{
		/*解析扩展名*/
		extensions: ['.js', '.vue'],
		alias: {
			'vue': 'vue/dist/vue.js'
		}
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: false,
			mangle: true,
			compress: {
				warnings: false
			}
		}),
		new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./index.html'
        })
	],
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		//contentBase: path.resolve(__dirname, './dist'),
		host: 'localhost',
		compress: true,
		port: 8099
	}
}