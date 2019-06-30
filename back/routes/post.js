const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { isLoggedIn } = require('./middleware');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
	region: 'ap-northeast-2',
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'where-code-nodebird',
		key(req, file, cb){
			cb(null, `postImage/${+new Date()}${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // upload.none()인 경우 req.fil(s) 대신 req.body로 받는다
	try{
		const hashtags = req.body.content.match(/#[^\s]+/g);
		const newPost = await db.Post.create({
			content: req.body.content,
			UserId: req.user.id,
		});
		if(hashtags){
			const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ // findOrCreate -> 있으면 찾고 없으면 생성
				where: { name: tag.slice(1).toLowerCase() }, // toLowerCase -> 소문자로 변경
			})));
			await newPost.addHashtags(result.map(r => r[0]));
		}
		if(req.body.image){
			if(Array.isArray(req.body.image)){
				const images = await Promise.all(req.body.image.map((image) => {
					return db.Image.create({ src: image });
				}));
				await newPost.addImages(images);
			}else{
				const image = await db.Image.create({ src: req.body.image });
				await newPost.addImage(image);
			}
		}
		const fullPost = await db.Post.findOne({
			where: {id: newPost.id},
			include: [{
				model: db.User,
			}, {
				model: db.Image,
			}],
		});
		res.json(fullPost);
	}catch(e){
		console.error(e);
		next(e);
	}
});

router.post('/images', upload.array('image'), (req, res) => {
	res.json(req.files.map(v => v.location));
});

router.get('/:id', async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.params.id },
			include: [{
				model: db.User,
				attributes: ['id', 'nickname'],
			}, {
				model: db.Image,
			}],
		});
		res.json(post);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
	try{
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if(!post){
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		await db.Post.destroy({ where: { id: req.params.id } });
		res.send(req.params.id);
	}catch(e){
		console.error(e);
		next(e);
	}
});

router.get('/:id/comments', async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		const comments = await db.Comment.findAll({
			where: {
				PostId: req.params.id,
			},
			order: [['createdAt', 'ASC']],
			include: [{
				model: db.User,
				attributes: ['id', 'nickname'],
			}],
		});
		res.json(comments);
	} catch (e) {
		console.error(e);
		next(e);
	}
});
  
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		const newComment = await db.Comment.create({
			PostId: post.id,
			UserId: req.user.id,
			content: req.body.content,
		});
		await post.addComment(newComment.id);
		const comment = await db.Comment.findOne({
			where: {
				id: newComment.id,
			},
			include: [{
				model: db.User,
				attributes: ['id', 'nickname'],
			}],
		});
		return res.json(comment);
	} catch (e) {
		console.error(e);
		return next(e);
	}
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
	try{
		const post = await db.Post.findOne({ where: { id: req.params.id } })
		if(!post){
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		await post.addLiker(req.user.id);
		res.json({ userId: req.user.id })
	}catch(e){
		console.error(e);
		next(e);
	}
})

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
	try{
		const post = await db.Post.findOne({ where: { id: req.params.id } })
		if(!post){
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		await post.removeLiker(req.user.id);
		res.json({ userId: req.user.id })
	}catch(e){
		console.error(e);
		next(e);
	}
})

router.post('/:id/retweet', isLoggedIn, async (req, res ,next) => {
	try{
		const post = await db.Post.findOne({
			where: { id: req.params.id},
			include: [{
				model: db.Post,
				as: 'Retweet',
			}],
		});
		if(!post){
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)){
			return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
		}
		const retweetTrargetId = post.RetweetId || post.id;
		const exPost = await db.Post.findOne({
			where: {
				UserId: req.user.id,
				RetweetId: retweetTrargetId,
			},
		})
		if(exPost){
			return res.send(403).send('이미 리트윗했습니다.');
		}
		const retweet = await db.Post.create({
			UserId: req.user.id,
			RetweetId: retweetTrargetId,
			content: 'retweet',
		})
		const retweetWithPrevPost = await db.Post.findOne({
			where: { id: retweet.id },
			include: [{
				model: db.User,
				attributes: ['id', 'nickname'],
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
		});
		return res.json(retweetWithPrevPost);
	}catch(e){
		console.error(e);
		next(e);
	}
});

module.exports = router;