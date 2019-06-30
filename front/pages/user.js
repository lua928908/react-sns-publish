import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card  } from 'antd';
import PostCard from '../components/PostCard';

const User = ({ id }) => {
	const dispatch = useDispatch();
	const {userInfo} = useSelector(state => state.user);
	const {mainPosts} = useSelector(state => state.post);

	return (
		<div>
			{ userInfo
			? <Card
				actions={[
					<div key="twit">
						짹짹
						<br />
						{userInfo.Posts}
					</div>,
					<div key="following">
						팔로잉
						<br />
						{userInfo.Followings}
					</div>,
					<div key="following">
						팔로워
						<br />
						{userInfo.Followers}
					</div>
				]}>
					<Card.Meta
						avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
						title={userInfo.nickname}
					/>
				</Card>
			: null }
			{mainPosts.map((c) => (
				<PostCard key={c.id} post={c}></PostCard>
			))}
		</div>
	);
};

User.propTypes = {
	id: PropTypes.number.isRequired,
};

User.getInitialProps = async (context) => {
	const id = parseInt( context.query.id );
	context.store.dispatch({
		type: 'LOAD_USER_REQUEST',
		data: id,
	})
	context.store.dispatch({
		type: 'LOAD_USER_POSTS_REQUEST',
		data: id,
	});
	return { id };
};

export default User;