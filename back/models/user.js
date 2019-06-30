module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', { // 앞글자가 대문자면 자동으로 복수형(s가 붙음)으로 바뀐다.
		nickname: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
	}, {
		charset: 'utf8', // utf8로 인코딩
		collate: 'utf8_general_ci',
		timestamps: true, // 해당옵션이 true 여야 paranoid 사용 가능
		paranoid: true, // 삭제시간 기재
	});

	// db의 관계 설정
	User.associate = (db) => {
		db.User.hasMany(db.Post, { as: 'Posts' });
		db.User.hasMany(db.Comment);
		db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
		db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
		db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
	}
	
	return User;
}

/*
	as 는 자바스크립트에서 db의 값을 가져올때 쓰일이름
	foreignKey는 db의 컬럼이름으로 쓰일 이름
*/