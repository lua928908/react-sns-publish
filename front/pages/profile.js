import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form,List,Input,Button,Card,Icon } from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';
import PostCard from '../components/PostCard';
import FollowList from '../components/FollowList';

const Profile = () => {
	const dispatch = useDispatch();
	const { followerList, followingList, hasMoreFollower, hasMoreFollowing } = useSelector(state => state.user);
	const { mainPosts } = useSelector(state => state.post);

	const onUnfollow = useCallback((userId) => () => {
		dispatch({
			type: 'UNFOLLOW_USER_REQUEST',
			data: userId,
		})
	}, []);

	const onRemoveFollower = useCallback((userId) => () => {
		dispatch({
			type: 'REMOVE_FOLLOWER_REQUEST',
			data: userId,
		});
	}, []);

	const loadMoreFollowings = useCallback(() => {
		dispatch({
			type: 'LOAD_FOLLOWINGS_REQUEST',
			offset: followingList.length,
		});
	}, [followingList.length]);

	const loadMoreFollowers = useCallback(() => {
		dispatch({
			type: 'LOAD_FOLLOWERS_REQUEST',
			offset: followerList.length,
		});
	}, [followerList.length]);

	return (
		<>
			<div>
				<NicknameEditForm />
				<FollowList
					header="팔로잉 목록"
					hasMore={hasMoreFollowing}
					onClickMore={loadMoreFollowings}
					data={followingList}
					onClickStop={onUnfollow}
				/>
				<FollowList
					header="팔로워 목록"
					hasMore={hasMoreFollower}
					onClickMore={loadMoreFollowers}
					data={followerList}
					onClickStop={onRemoveFollower}
				/>
				<div>
					{mainPosts.map(c => (
						<PostCard key={c.id} post={c} />
					))}
				</div>
			</div>
		</>
	)
};

Profile.getInitialProps = async (context) => {
	const state = context.store.getState();

	// 이전에 LOAD_USER_REQUEST 실행
	context.store.dispatch({
		type: 'LOAD_FOLLOWERS_REQUEST',
		data: state.user.me && state.user.me.id
	});
	context.store.dispatch({
		type: 'LOAD_FOLLOWINGS_REQUEST',
		data: state.user.me && state.user.me.id
	});
	context.store.dispatch({
		type: 'LOAD_USER_POSTS_REQUEST',
		data: state.user.me && state.user.me.id
	});

	// 이쯤에 LOAD_USER_SUCCESS가 되며 me가 생김, me가 null이면 본인인 것 으로 해결
};

export default Profile;