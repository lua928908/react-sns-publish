import {all, call} from 'redux-saga/effects';
import user from './user';
import post from './post';
import axios from 'axios';
import { backUrl } from '../config/index';

console.log('backUrl = ' + backUrl);
axios.defaults.baseURL = `${backUrl}/api`;

export default function* rootSaga() {
	yield all([
		call(user),
		call(post),
	]);
};