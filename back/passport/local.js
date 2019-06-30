const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models/index');

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: 'userId',
		passwordField: 'password',
	}, async (userId, password, done) => {
		try{
			const user = await db.User.findOne({ where: {userId} });
			if (!user){
				return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
			}
			const result = await bcrypt.compare(password, user.password);
			if(result){
				done(null, user);
			}else{
				done(null, false, { reason: '비밀번호가 틀립니다.' });
			}
		}catch(e){
			console.error(e);
			return done(e);
		}
	}));
};

// done(서버에러, 사용자정보, 실패정보)