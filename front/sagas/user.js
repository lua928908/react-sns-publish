import { all, fork, takeLatest, takeEvery, call, put, delay } from 'redux-saga/effects';
import {
	LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
	SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
	LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
	LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
	FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE,
	UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_FAILURE,
	LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE,
	LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE,
	REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE,
	EDIT_NICKNAME_REQUEST, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE,
} from '../reducers/user';
import axios from 'axios';

// 로그인
function logInAPI(loginData){
	return axios.post('/user/login', loginData, {
		// 쿠키를 주고받는 옵션, 서버에서도 옵션을 설정해야가능.
		withCredentials: true
	});
};
function* logIn(action){
	try{
		const result = yield call(logInAPI, action.data);
		yield put({
			type: LOG_IN_SUCCESS,
			data: result.data,
		});
	}catch(e){
		console.error(e);
		yield put({
			type: LOG_IN_FAILURE,
			reason: e.response && e.response.data,
		});
	}
};
function* watchLogIn(){
	yield takeLatest(LOG_IN_REQUEST, logIn);
}

 // 회원가입
function signUpAPI(singupData){
	return axios.post('/user/', singupData);
};
function* signUp(action){
	try{
		yield call(signUpAPI, action.data);
		alert('회원가입 완료');
		yield put({
			type: SIGN_UP_SUCCESS,
		});
	} catch(e){
		console.error(e);
		yield put({
			type: SIGN_UP_FAILURE,
			error: e
		});
	}
};
function* watchSingUp(){
	yield takeEvery(SIGN_UP_REQUEST, signUp)
};

// 로그아웃
function logOutAPI(){
	// post요청은 data를 의미하는데 비어있는 경우 빈객체라도 넣어야함
	return axios.post('/user/logout/', {}, {
		withCredentials: true,
	});
};
function* logOut(){
	try{
		yield call(logOutAPI);
		yield put({
			type: LOG_OUT_SUCCESS,
		});
	} catch(e){
		console.error(e);
		yield put({
			type: LOG_OUT_FAILURE,
			error: e
		});
	}
};
function* watchLogOut(){
	yield takeLatest(LOG_OUT_REQUEST, logOut)
};

// 로드유저
function loadUserAPI(userId){
	// get요청은 data가 없어 두번째 인자가 옵션이 된다.
	return axios.get(userId ? `/user/${userId}` : '/user/', {
		withCredentials: true,
	});
};
function* loadUser(action) {
	try {
		const result = yield call(loadUserAPI, action.data);
		yield put({
			type: LOAD_USER_SUCCESS,
			data: result.data,
			me: !action.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_USER_FAILURE,
			error: e,
		});
	}
};
function* watchLoadUser(){
	yield takeEvery(LOAD_USER_REQUEST, loadUser)
};

// 팔로우
function followAPI(userId) {
	return axios.post(`/user/${userId}/follow`, {}, {
		withCredentials: true
	});
  }
function* follow(action) {
	try {
		const result = yield call(followAPI, action.data);
		yield put({
			type: FOLLOW_USER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: FOLLOW_USER_FAILURE,
			error: e,
		});
		alert(e.response && e.response.data);
	}
};
function* watchFollow(){
	yield takeLatest(FOLLOW_USER_REQUEST, follow);
};

// 언팔로우
function unfollowAPI(userId) {
	return axios.delete(`/user/${userId}/follow`, {
		withCredentials: true
	});
  }
function* unfollow(action) {
	try {
		const result = yield call(unfollowAPI, action.data);
		yield put({
			type: UNFOLLOW_USER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: UNFOLLOW_USER_FAILURE,
			error: e,
		});
		alert(e.response && e.response.data);
	}
};
function* watchUnfollow(){
	yield takeLatest(UNFOLLOW_USER_REQUEST, unfollow);
};

// 나를 팔로워한 목록
function loadFollowersAPI(userId, offset = 0, limit = 3) {
	return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
		withCredentials: true
	});
  }
function* loadFollowers(action) {
	try {
		const result = yield call(loadFollowersAPI, action.data, action.offset);
		yield put({
			type: LOAD_FOLLOWERS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_FOLLOWERS_FAILURE,
			error: e,
		});
	}
};
function* watchLoadFollower(){
	yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
};

// 내가 팔로잉한 목록
function loadFollowingsAPI(userId, offset = 0, limit = 3) {
	return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
		withCredentials: true
	});
  }
function* loadFollowings(action) {
	try {
		const result = yield call(loadFollowingsAPI, action.data, action.offset);
		yield put({
			type: LOAD_FOLLOWINGS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_FOLLOWINGS_FAILURE,
			error: e,
		});
	}
};
function* watchLoadFollowings(){
	yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
};

// 팔로잉 삭제
function removeFollowerAPI(userId) {
	return axios.delete(`/user/${userId}/follower`, {
		withCredentials: true
	});
  }
function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.data);
		yield put({
			type: REMOVE_FOLLOWER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: REMOVE_FOLLOWER_FAILURE,
			error: e,
		});
		alert(e.response && e.response.data);
	}
};
function* watchRemoveFollower(){
	yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
};

// 닉네임 수정
function editNicknameAPI(nickname) {
	return axios.patch(`/user/nickname`, { nickname }, {
		withCredentials: true
	});
  }
function* editNickname(action) {
	try {
		const result = yield call(editNicknameAPI, action.data);
		yield put({
			type: EDIT_NICKNAME_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: EDIT_NICKNAME_FAILURE,
			error: e,
		});
		alert(e.response && e.response.data);
	}
};
function* watchEditNickname(){
	yield takeLatest(EDIT_NICKNAME_REQUEST, editNickname);
};

export default function* userSaga (){
	yield all([
		fork(watchLogIn),
		fork(watchLogOut),
		fork(watchSingUp),
		fork(watchLoadUser),
		fork(watchFollow),
		fork(watchUnfollow),
		fork(watchLoadFollower),
		fork(watchLoadFollowings),
		fork(watchRemoveFollower),
		fork(watchEditNickname),
	]);
};

/*
	all: 
	call: 함수를 동기로 호출한다.
	fork: 함수를 비동기로 호출한다.
	take: 인자로 들어온 Actions이 실행되면 next()를 통해 함수를 재개한다. 실행후 함수재호출 불가능 ( done: true )
	takeEvery: 대부분의 Action은 여러번 실행이 가능해야 하기때문에 done: false가 유지되도록 해준다, 반복실행가능
	takeLatest: Action이 동시적으로 여러번 실행될 경우 최근실행된 Action만 유효하게 취급한다.
	delay: 타이머기능, ms 단위로 딜레이를 만든다.
	race:
	cancel:
	select:
	throttle: 같은 함수가 계속 호출되는것은 막아준다(request 요청 중복을 방지함), scroll 이벤트에 많이사용
*/