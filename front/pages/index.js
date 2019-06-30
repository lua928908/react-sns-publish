import React, { useEffect, useRef } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useSelector, useDispatch } from 'react-redux';

const Home = () => {
	const { me } = useSelector(state => state.user);
	const { mainPosts, hasMorePost } = useSelector(state => state.post);
	let scrollEvent = useRef(null);
	const dispatch = useDispatch();

	const onScroll = () => {
		let scrollHeight = window.scrollY // 브라우저 scroll 높이
		let screenHeight = document.documentElement.clientHeight // 화면크기
		let documentHeight = document.documentElement.scrollHeight // 도큐먼트 전체크기

		clearTimeout(scrollEvent.current);
		scrollEvent.current = setTimeout(() => {
			if(scrollHeight + screenHeight > documentHeight - 300){
				if(hasMorePost){
					dispatch({
						type: 'LOAD_MAIN_POSTS_REQUEST',
						lastId: mainPosts[mainPosts.length - 1].id,
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
		<>
			{me && <PostForm />}
			{mainPosts.map((c) => {
				return (
					<PostCard key={c.id} post={c} />
				);
			})}
		</>
	);
};

Home.getInitialProps = async (context) => {
	context.store.dispatch({
		type: 'LOAD_MAIN_POSTS_REQUEST',
	});
}

export default Home;