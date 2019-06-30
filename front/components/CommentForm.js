import React, { useEffect, useState, useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

const CommentForm = ({ post }) => {
	const [commentText, setCommentText] = useState('');
	const { commentAdded, isAddingComment } = useSelector(state => state.post);
	const { me } = useSelector(state => state.user);
	const dispatch = useDispatch();

	const onSubmitComment = useCallback((e) => {
		e.preventDefault();
		if(!me){
			return alert('로그인이 필요합니다.');
		}
		dispatch({
			type: 'ADD_COMMENT_REQUEST',
			data: {
				postId: post.id,
				content: commentText,
			},
		})
	}, [me && me.id, commentText]);
	const onChangeCommentText = useCallback((e) => {
		setCommentText(e.target.value);
	}, []);

	useEffect(() => {
		setCommentText('');
	}, [commentAdded === true]);


	return (
		<Form onSubmit={onSubmitComment}>
			<Form.Item>
				<Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
			</Form.Item>
			<Button type="primary" htmlType="submit" loading={isAddingComment}>삐약</Button>
		</Form>
	)
};

CommentForm.propTypes = {
	post: PropTypes.object.isRequired,
};

export default CommentForm;