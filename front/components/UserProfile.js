import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import Link from 'next/link';
import styled from 'styled-components';

const Log_out = styled(Button)`
	margin-top: 10px;
`;

const UserProfile = () => {
	const { me } = useSelector(state => state.user);
	const dispatch = useDispatch();

	const onLogout = useCallback(() => {
		dispatch({
			type: LOG_OUT_REQUEST,
		});
	}, []);
	return (
		<Card actions={[
			<Link href="/profile" key="twit" prefetch><a><div>게시글<br />{me.Posts.length}</div></a></Link>,
			<Link href="/profile" key="following" prefetch><a><div>팔로잉<br />{me.Followings.length}</div></a></Link>,
			<Link href="/profile" key="follower" prefetch><a><div>팔로워<br />{me.Followers.length}</div></a></Link>,
		]}>
			<Card>
				<Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
			</Card>
			<Log_out onClick={onLogout}>로그아웃</Log_out>
		</Card>
	);
}

export default UserProfile;