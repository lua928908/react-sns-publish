const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
	distDir: '.next', // 빌드한 이후 디렉토리 설정
	analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
	analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
	bundleAnalyzerConfig: {
		server: {
			analyzerMode: 'static',
			reportFilename: '../bundles/server.html',
		},
		browser: {
			analyzerMode: 'static',
			reportFilename: '../bundles/client.html',
		},
	},
	webpack(config) { // webpack 빌드설정을 변경
		const prod = process.env.NODE_ENV === 'production';
		const plugins = [
			...config.plugins,
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/), // moment 'ko'만 사용
		];
		if(prod){
			plugins.push( new CompressionPlugin() ); // gzip으로 압축해줌
		}

		return {
			...config, // 기존에 있던 설정은 그대로 가져오고 바뀔 부분만 변경
			mode: prod ? 'production' : 'development',
			devtool: prod ? 'hidden-source-map' : 'eval',
			plugins,
		};
	}
});

/*
	hidden-source-map: 소스코드 숨기면서 에러시 소스맵제공
	eval: 빠르게 웹팩 적용
*/
