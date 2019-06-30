import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
	const dispatch = useDispatch();
	const { mainPosts, hasMorePost } = useSelector(state => state.post);
	let scrollEvent = useRef(null);

	const onScroll = () => {
		let scrollHeight = window.scrollY // 브라우저 scroll 높이
		let screenHeight = document.documentElement.clientHeight // 화면크기
		let documentHeight = document.documentElement.scrollHeight // 도큐먼트 전체크기

		clearTimeout(scrollEvent.current);
		scrollEvent.current = setTimeout(() => {
			if(scrollHeight + screenHeight > documentHeight - 300){
				if(hasMorePost){
					dispatch({
						type: 'LOAD_HASHTAG_POSTS_REQUEST',
						lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
						data: tag,
					});
				}
			}
		}, 150);
	}

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => { // 지우지 않으면 페이지 이동시 event가 쌓임
			window.removeEventListener('scroll', onScroll);
		};
	}, [mainPosts.length]);

	return (
		<div>
			{
				mainPosts.map((c) => (
					<PostCard key={c.id} post={c} />
				))
			}
		</div>
	);
}


Hashtag.propTypes = {
	tag: PropTypes.string.isRequired,
  };

Hashtag.getInitialProps = async (context) => {
	const tag = context.query.tag;
	context.store.dispatch({
		type: 'LOAD_HASHTAG_POSTS_REQUEST',
		data: tag,
	});

	return { tag };
};

export default Hashtag;