import { Button, Form, Input } from 'antd';
import React, {useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NicknameEditForm = () => {
	const [editedName, setEditedName] = useState('');
	const dispatch = useDispatch();
	const { me, isEditingNickname } = useSelector(state => state.user);

	const onChangeNickname = useCallback((e) => {
		setEditedName(e.target.value);
	}, []);
	const onEditNickname = useCallback((e) => {
		e.preventDefault();
		dispatch({
			type: 'EDIT_NICKNAME_REQUEST',
			data: editedName,
		})
	}, [editedName]);

	return (
		<Form stype={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }} onSubmit={onEditNickname}>
			<Input addonBefore="닉네임" value={editedName || (me && me.nickname)} onChange={onChangeNickname}></Input>
			<Button type="primary" htmlType="submit" loading={isEditingNickname}>수정</Button>
		</Form>
	);
};

export default NicknameEditForm;