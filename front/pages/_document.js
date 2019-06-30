import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// 아직 Hooks로 _document 를 지원하지 않음.
class MyDocument extends Document {

	// Class 에서는 getInitialProps가 static으로 들어간다
	static getInitialProps(context) {
		const sheet = new ServerStyleSheet(); // styled-component를 위한 SSR - 01
		// context.renderPage()를 해줘야 _app.js의 내용이 렌더링 된다.
		const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
		const styleTags = sheet.getStyleElement(); // styled-component를 위한 SSR - 02
		return { ...page, helmet: Helmet.renderStatic(), styleTags };
	}

	render() {
		const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
		const htmlAttrs = htmlAttributes.toComponent(); // 객체형태기 때문에 toComponent()를 통해 react에서 쓸수있는 컴포넌트 형태로 바꾸어야 한다.
		const bodyAttrs = bodyAttributes.toComponent();

		return (
			<html {...htmlAttrs}>
				<head>
					{this.props.styleTags}
					{Object.values(helmet).map(el => el.toComponent())}
				</head>
				<body {...bodyAttrs}>
					<Main />
					{
						process.env.NODE_ENV === 'production' &&
						<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
					}
					<NextScript />
				</body>
			</html>
		);
	}
};

MyDocument.propTypes = {
	helmet: PropTypes.object.isRequired,
	styleTags: PropTypes.object.isRequired,
};

export default MyDocument;

/*
	<Main /> -> pages/_app.js 가 된다.
	<NextScript /> -> next 서버 구동에 필요한 js
*/