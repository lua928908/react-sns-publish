const express = require('express');
const db = require('./models/index');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./passport/index');
const hpp = require('hpp');
const helmet = require('helmet');

const prod = process.env.NODE_ENV === 'production';
dotenv.config(); // dotenv 실행
db.sequelize.sync(); // sequelize 실행
passportConfig();

if(prod){
	app.use(hpp());
	app.use(helmet());
	app.use(morgan('combined'));
	app.use(cors({
		origin: 'http://where-code.com',
		credentials: true,
	}))
}else{
	app.use(morgan('dev'));
	app.use(cors({
		origin: true, // true는 모든요청 허용 origin, credentials 옵션이 있어야 주소가 다른 서버에서 쿠키를 주고받을 수 있다.
		credentials: true,
	}));
}

app.use(express.json()); // res.json 처리
app.use(express.urlencoded({extended: true})) // form 처리
app.use('/', express.static('uploads'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
	resave: false, // 매번 새로저장
	saveUninitialized: false, // 빈값도 저장
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true, // cookie를 자바스크립트에서 접근할 수 없음.
		secure: false, // https를 사용할때 true
		domain: prod && '.where-code.com',
	},
	name: 'example_STRING' // express는 자동으로 로그인 쿠키에 connet.sid라는 이름을 붙이는데 보안에 취약할 수 있기에 이름을 변경해준다.
}));
app.use(passport.initialize()); // passport init
app.use(passport.session()); // expressSession 보다 밑에 있어야함, 미들웨어간의 의존관계 때문에.

const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashTagAPIRouter = require('./routes/hashtag');

app.get('/', (req, res) => {
	res.send('메인입니다.');
});

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashTagAPIRouter);

app.listen(prod ? process.env.PORT : 8080 , () => {
	console.log(`server is running on ${process.env.PORT}`);
});