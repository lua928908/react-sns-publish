const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', async (req, res, next) => {
	try{
		let where = {};
		if(parseInt(req.query.lastId, 10)){
			where = {
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
				}
			}
		}
		const posts = await db.Post.findAll({
			// 글을 가져올때 order로 순서정렬 가능
			where,
			include: [{
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
				}],
			}],
			order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
			limit: parseInt(req.query.limit, 10),
		});
		res.json(posts);
	}catch(e){
		console.error(e);
		next(e);
	}
});

module.exports = router;