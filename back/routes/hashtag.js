const express = require('express');
const db = require('../models/index');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {
	try{
		let where = {};
		if(parseInt(req.query.lastId, 10)){
			where = {
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
				},
			};
		}
		const posts = await db.Post.findAll({
			where,
			include: [{
				model: db.Hashtag,
				// 주소에 쓰인 특수문자,한글은 URIComponent로 변경되는데 이걸 다시 원래글자로 받아서 서버에 주어야한다.
				where: { name: decodeURIComponent(req.params.tag) },
			}, {
				model: db.User,
				attributes: ['id', 'nickname'],
			}, {
				model: db.Image,
			}, {
				model: db.User,
				through: 'Like',
				as: 'Likers',
				attributes: ['id'],
			}, {
				model: db.Post,
				as: 'Retweet',
				include: [{
					model: db.User,
					attributes: ['id', 'nickname'],
				}, {
					model: db.Image,
				}]
			}],
			order: [['createdAt', 'DESC']],
			limit: parseInt(req.query.limit, 10),
		});
		res.json(posts);
	}catch(e){
		console.error(e);
		next(e);
	}
});

module.exports = router;