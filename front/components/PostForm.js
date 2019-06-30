import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form,Input,Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST } from '../reducers/post';


const PostForm = () => {
	const dispatch = useDispatch();
	const {imagePaths, isAddingPost, postAdded} = useSelector(state => state.post);
	const [text, setText] = useState('');
	const imageInput = useRef();

	const onSubmitForm = useCallback((e) => {
		e.preventDefault();
		if(!text || !text.trim()){
			return alert('게시글을 작성해주세요.');
		}
		const formData = new FormData();
		imagePaths.forEach((i) => {
			formData.append('image', i);
		});
		formData.append('content', text);
		dispatch({
			type: ADD_POST_REQUEST,
			data: formData,
		});
	}, [text, imagePaths]);

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	});

	const onChangeImages = useCallback((e) => {
		const imageFormData = new FormData();
		[].forEach.call(e.target.files, (f) => {
			imageFormData.append('image', f); // upload.array() 할때 key의 이름이 같아야함.
		});
		dispatch({
			type: 'UPLOAD_IMAGES_REQUEST',
			data: imageFormData,
		});
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onRemoveImage = useCallback((index) => () => {
		dispatch({
			type: 'REMOVE_IMAGE',
			index,
		});
	});

	useEffect(()=>{
		setText('');
	}, [postAdded === true]);

	return (
		<Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onSubmit={onSubmitForm}>
			<Input.TextArea max-length={140} placeholder="어떤 일이 있었나요?" value={text} onChange={onChangeText}></Input.TextArea>
			<div>
				<input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>게시하기</Button>
			</div>
			<div>
				{imagePaths.map((v, i) => {
					return (
						<div key={v} style={{ display: 'inline-block' }}>
							<img src={v} style={{ width: '200px' }} alt={v}/>
							<div>
								<Button onClick={onRemoveImage(i)}>제거</Button>
							</div>
						</div>
					)
				})}
			</div>
		</Form>
	)
};

export default PostForm;