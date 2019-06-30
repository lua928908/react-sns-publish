import produce from 'immer';

// 기본 state의 상태
export const initialState = {
	isLoggingIn: false, // 로그인 시도중
	logInErrorReason: '', // 로그인 에러 사유
	isLogginOut: false, // 로그아웃 시도중
	singedUp: false, // 회원가입 성공
	isSigningUp: false, // 회원가입 시도중
	signUpErrorReason: '', // 회원가입 실패 사유
	me: null, // 내 정보
	followingList: [], // 팔로잉 리스트
	followerList: [], // 팔로워 리스트
	userInfo: null, // 타인의 정보
	isEditingNickname: false, // 닉네임 변경중
	editNicknameErrorReason: '', // 닉네임 변경실패 에러메세지
	hasMoreFollower: false, // 더이상 팔로워가 있는지 여부
	hasMoreFollowing: false, // 더이상 팔로잉이 있는지 여부
};

// Action의 이름만 정해놓고 dispatch할때 데이터를 직접 전달
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE'

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';


const reducer = (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			case LOG_IN_REQUEST: {
				draft.isLoggingIn = true;
				draft.loginErrorReason = '';
				break;
			}
			case LOG_IN_SUCCESS: {
				draft.isLoggingIn = false;
				draft.me = action.data;
				draft.isLoading = false;
				draft.loginErrorReason = '';
				break;
			}
			case LOG_IN_FAILURE: {
				draft.isLoggingIn = false;
				draft.loginErrorReason = action.reason;
				draft.me = null;
				break;
			}
			case LOG_OUT_REQUEST: {
				draft.isLoggingOut = true;
				break;
			}
			case LOG_OUT_SUCCESS: {
				draft.isLoggingOut = false;
				draft.me = null;
				break;
			}
			case LOG_OUT_FAILURE: {
				break;
			}
			case SIGN_UP_REQUEST: {
				draft.isSigningUp = true;
				draft.isSignedUp = false;
				draft.signUpErrorReason = '';
				break;
			}
			case SIGN_UP_SUCCESS: {
				draft.isSigningUp = false;
				draft.isSignedUp = true;
				break;
			}
			case SIGN_UP_FAILURE: {
				draft.isSigningUp = false;
				draft.signUpErrorReason = action.error;
				break;
			}
			case LOAD_USER_REQUEST: {
				break;
			}
			case LOAD_USER_SUCCESS: {
				if(action.me){
					draft.me = action.data;
					break;
				}
				draft.userInfo = action.data;
				break;
			}
			case LOAD_USER_FAILURE: {
				return {
					...state,
				}
			}
			case FOLLOW_USER_REQUEST: {
				break;
			}
			case FOLLOW_USER_SUCCESS: {
				draft.me.Followings.unshift({ id: action.data });
				break;
			}
			case FOLLOW_USER_FAILURE: {
				break;
			}
			case UNFOLLOW_USER_REQUEST: {
				break;
			}
			case UNFOLLOW_USER_SUCCESS: {
				const index01 = draft.me.Followings.findIndex(v => v.id === action.data);
				draft.me.Followings.splice(index01, 1);
				const index02 = draft.followingList.findIndex(v => v.id === action.data);
				draft.followingList.splice(index02, 1);
				break;
			}
			case UNFOLLOW_USER_FAILURE: {
				break;
			}
			case ADD_POST_TO_ME: {
				draft.me.Posts.push({ id: action.data });
				break;
			}
			case REMOVE_POST_OF_ME: {
				const index = draft.me.Posts.findIndex(v => v.id === action.data);
				draft.me.Posts.splice(index, 1);
				break;
			}
			case LOAD_FOLLOWERS_REQUEST: {
				draft.followerList = !action.offset ? [] : draft.followerList;
				draft.hasMoreFollower = action.offset ? draft.hasMoreFollower : true; // 사용자가 처음 더보기버튼을 눌러 데이터를 가져올때, 더보기 버튼 true
				break;
			}
			case LOAD_FOLLOWERS_SUCCESS: {
				action.data.forEach((v) => {
					draft.followerList.push(v);
				});
				draft.hasMoreFollower = action.data.length === 3
				break;
			}
			case LOAD_FOLLOWERS_FAILURE: {
				break;
			}
			case LOAD_FOLLOWINGS_REQUEST: {
				draft.followingList = !action.offset ? [] : draft.followingList;
				draft.hasMoreFollowing = action.offset ? draft.hasMoreFollowing: true; // 사용자가 처음 더보기버튼을 눌러 데이터를 가져올때, 더보기 버튼 true
				break;
			}
			case LOAD_FOLLOWINGS_SUCCESS: {
				action.data.forEach((v) => {
					draft.followingList.push(v);
				});
				draft.hasMoreFollowing = action.data.length === 3;
				break;
			}
			case LOAD_FOLLOWINGS_FAILURE: {
				break;
			}
			case REMOVE_FOLLOWER_REQUEST: {
				break;
			}
			case REMOVE_FOLLOWER_SUCCESS: {
				const index01 = draft.me.Followers.findIndex(v => v.id === action.data);
				draft.me.Followers.splice(index01, 1);
				const index02 = draft.followerList.findIndex(v => v.id === action.data);
				draft.followerList.splice(index02, 1);
				break;
			}
			case REMOVE_FOLLOWER_FAILURE: {
				break;
			}
			case EDIT_NICKNAME_REQUEST: {
				draft.isEditingNickname = true;
				draft.editNicknameErrorReason = '';
				break;
			}
			case EDIT_NICKNAME_SUCCESS: {
				draft.isEditingNickname = false;
				draft.me.nickname = action.data;
				break;
			}
			case EDIT_NICKNAME_FAILURE: {
				draft.isEditingNickname = false;
				draft.editNicknameErrorReason = action.error;
				break;
			}
			default: {
				break;
			}
		}
	});
};

export default reducer;