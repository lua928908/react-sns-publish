const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

// next와 express를 연결하기 위한 코드
const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';
const app = next({ prod });
const handle = app.getRequestHandler(); // get 요청 처리기
dotenv.config();

app.prepare().then(() => {
	const server = express();

	server.use(morgan('prod'));
	server.use('/', express.static(path.join(__dirname, 'public')));
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(cookieParser(process.env.COOKIE_SECRET));
	server.use(expressSession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: false,
		}
	}))


	// router
	server.get('/post/:id', (req, res,) => {
		return app.render(req, res, '/post', { id: req.params.id });
	});
	server.get('/hashtag/:tag', (req, res) => {
		return app.render(req, res, '/hashtag', { tag: req.params.tag }); // hashtag -> 해당 라우터에 반환할 next 페이지 이름
	});
	server.get('/user/:id', (req, res) => {
		return app.render(req, res, '/user', { id: req.params.id });
	})
	//모든요청 처리 -> *
	server.get('*', (req, res) => {
		return handle(req, res);
	})


	server.listen(prod ? process.env.PORT : 8000, () => {
		console.log(`next + express running on port ${process.env.PORT}`);
	});
});