module.exports = (sequelize, DataTypes) => {
	const Hashtag = sequelize.define('Hashtag', {
		name: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
	}, {
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
	});
	Hashtag.accosiate = (db) => {
		db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); // Hashtag + Post는 多 : 多 관계
	};
	return Hashtag;
}