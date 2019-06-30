exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){ // isAuthenticated -> passport에서 로그인여부를 확인하는 공식메서드
		next();
	}else{
		res.status(401).send('로그인이 필요합니다.');
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
		next();
	}else{
		res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
	}
};