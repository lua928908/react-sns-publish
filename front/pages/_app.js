import React from 'react';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; // next에서 redux-saga를 사용하기 위해
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers/index'; // 사용자가 만든 리덕스
import rootSaga from '../sagas/index';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Container } from 'next/app';

const NodeBird = ( {Component, store, pageProps} ) => { // 03. react-redux모듈을 통해 store를 react컴포넌트에게 전달한다.
	// Component는 next 에서 넣어주는 받는 props 이다, pages디렉토리의 파일이 라우터에 맞게 Component로 들어와 <Component /> 에서 노출된다.

	return (
		<Container>
		<Provider store={store}>
			<Helmet
				title="React SNS"
				htmlAttributes={{ lang: 'ko' }}
				meta={[
					{ charset: 'UTF-8' },
					{ name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover' },
					{ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
					{ name: 'description', content: 'lua928908 React SNS' },
					{ name: 'og:title', content: 'React SNS' },
					{ name: 'og:description', content: 'lua928908 React SNS' },
					{ property: 'og:type', content: 'website' },
					{ property: 'og:image', content: 'http://where-code.com/favicon.ico' },
				]}
				link={[
					{ rel: 'shortcut icon', href: '/favicon.ico' },
					{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.min.css' },
					{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css' },
					{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css' },
				]}
				script={[
					{ src: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.min.js' }
				]}
			/>
			<AppLayout>
				<Component {...pageProps} />
			</AppLayout>
		</Provider>
		</Container>
	);
};

NodeBird.propTypes = {
	Component: PropTypes.elementType.isRequired,
	store: PropTypes.object.isRequired,
	pageProps: PropTypes.object.isRequired,
};


/*
	getInitialProps는 일종의 라이프사이클이며, 서버사이드랜더링의 핵심이다.
	next && express -> getInitialProps 설정 -> 로그인,라우터 등등 처리
*/
NodeBird.getInitialProps = async (context) => { // context는 next 모듈이 전달해준다.
	const { ctx, Component } = context;
	const state = ctx.store.getState();
	const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
	let pageProps = {};
	
	if(ctx.isServer && cookie){
		axios.defaults.headers.Cookie = cookie; // axios 요청시 기본으로 headers에 쿠키를 추가.
	}

	if( !state.user.me ){
		ctx.store.dispatch({
			type: 'LOAD_USER_REQUEST',
		});
	}

	if( context.Component.getInitialProps ){
		// 각 컴포넌트가 return한 값이 pageProps에 담긴다.
		pageProps = await context.Component.getInitialProps(ctx) || {}; // component에 getInitialProps를 설정한다.
	}

	return { pageProps };
};

const configureStore = (initialState, options) => { // 02. next-redux-wrapper모듈이 root컴포넌트가 store를 prop로 받을 수 있게 해준다.
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [sagaMiddleware];
	const enhancer = process.env.NODE_ENV === 'production'
	? compose(applyMiddleware(...middlewares))
	: compose(
		applyMiddleware(...middlewares),
		!options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
	);
	const store = createStore(reducer, initialState, enhancer); // 01. redux모듈이 사용자가 만든 reducer를 토대로 store를 생성
	store.sagaTask = sagaMiddleware.run(rootSaga);
	return store;
}

export default withRedux(configureStore)(withReduxSaga(NodeBird));