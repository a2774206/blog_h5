
module.exports = {
	// 选项...
	// publicPath:'./',
	// assetsPublicPath:'./',
	"transpileDependencies": [
	  "vuetify"
	],
	publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
	// baseUrl: "./",
	runtimeCompiler: true,
	outputDir: "dist",
	assetsDir: "assets",
	indexPath: "index.html",
	filenameHashing: true,
	pages: undefined,
	lintOnSave: false,
	runtimeCompiler: false,
	transpileDependencies: [],
	productionSourceMap: false,
	crossorigin: undefined,
	integrity: false,

	// devServer:{//代理
	//     port:8086,
	//     proxy:'http://192.168.255.201:8082'
	// }
	css: {
		
	},
	pages:{
		 index: {
		      // 页面入口
		      entry: 'src/main.js',
		      // 模板来源
		      template: 'public/index.html',
		      // 在 dist/index.html 的输出
		      filename: 'index.html',
		      // 当使用 title 选项时，
		      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
		      title: 'Lipengpeng的博客',
		      // 在这个页面中包含的块，默认情况下会包含提取出来的通用 chunk 和 vendor chunk
		      chunks: [ 'chunk-vendors', 'chunk-common', 'index']
		    },
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: []
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.js'
			}
		},
		performance: {
			hints: 'warning',
			//入口起点的最大体积 整数类型（以字节为单位）
			maxEntrypointSize: 50000000,
			//生成文件的最大体积 整数类型（以字节为单位 300k）
			maxAssetSize: 30000000,
			//只给出 js 文件的性能提示
			assetFilter: function(assetFilename) {
				return assetFilename.endsWith('.js');
			}
		}
	}
}
