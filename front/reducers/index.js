import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const rootReducer = combineReducers({ // store들을 불러와 root에 합친다.
	user,
	post
});

export default rootReducer;