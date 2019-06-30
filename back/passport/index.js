const passport = require('passport');
const db = require('../models/index');
const local = require('./local');

module.exports = () => {
	// 최초 로그인시 id만 기억
	passport.serializeUser((user, done) => {
		return done(null, user.id);
	});
	
	// id를 토대로 db에서 정보를 검색
	passport.deserializeUser(async (id, done) => {
		try{
			const user = await db.User.findOne({
				where: { id },
				include: [{
					model: db.Post,
					as: 'Posts',
					attributes: ['id'],
				}, {
					model: db.User,
					as: 'Followings',
					attributes: ['id'],
				}, {
					model: db.User,
					as: 'Followers',
					attributes: ['id'],
				}],
			});
			return done(null, user); // req.user에 정보를 저장
		}catch(e){
			console.error(e);
			return done(e);
		}
	});

	local();
};