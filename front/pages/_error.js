import React from 'react';
import Error from 'next/error';
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {
	return (
		<div>
			<h1>{statusCode} Error가 발생했습니다.</h1>
		</div>
	)
};

MyError.defaultProps = {
	statusCode: 400,
}
MyError.getInitialProps = async (context) => {
	const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
	return { statusCode };
};

MyError.propTypes = {
	statusCode: PropTypes.number,
}

export default MyError;