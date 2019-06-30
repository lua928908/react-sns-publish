module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define('Post', {
		content: {
			type: DataTypes.TEXT, // 몇글자인지 모르는 긴 글
			allowNull: false,
		},
	}, {
		charset: 'utf8mb4', // 한글 + 이모티콘을 사용한다.
		collate: 'utf8mb4_general_ci',
	});
	Post.associate = (db) => {
		db.Post.belongsTo(db.User);
		db.Post.hasMany(db.Comment);
		db.Post.hasMany(db.Image);
		db.Post.belongsTo(db.Post, { as: 'Retweet' }); // Post는 리트윗될 수 있다, 이름이 같기때문에 as 구분한다.
		db.Post.belongsToMany(db.User, { through: 'Like' });
		db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // Post + Hashtag는 多 : 多 관계
		db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
	};
	
	return Post;
}