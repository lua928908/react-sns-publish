import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Icon } from 'antd';
import styled from 'styled-components';

const Overlay = styled.div`
	position: fixed;
	z-index: 5000;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

const Header = styled.header`
	height: 44px;
	background: white;
	position: relative;
	padding: 0;
	text-align: center;

	& h1{
		margin: 0;
		font-size: 17px;
		color: #333;
		line-height: 44px;
	}
`;
const SlickWrapper = styled.div`
	height: calc(100% - 44px);
	background: #090909;
`;
const CloseBtn = styled(Icon)`
	position: absolute;
	right: 0;
	top: 0;
	padding: 20px;
	line-height: 14px;
	cursor: pointer;
`;
const Indicator = styled.div`
	text-align: center;

	& > div {
		width: 75px;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
		background: #313131;
		display: inline-block;
		text-align: center;
		color: white;
		font-size: 15px;
	}
`;
const ImgWrapper = styled.div`
	padding: 32px;
	text-align: center;

	& img {
		margin: 0 auto;
		max-height: 750;
	}
`;

const ImagesZoom = ({ images, onClose }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	return (
		<>
		<Overlay>
			<Header>
				<h1>상세 이미지</h1>
				<CloseBtn type="close" onClick={onClose} />
			</Header>
			<SlickWrapper>
				<div>
					<Slick
						initialSlide={0} // 몇번째 요소가 처음 보여지는지
						afterChange={(slide) => setCurrentSlide(slide)} // 슬라이드 발생시 index 변경
						infinite={false}
						arrows
						slideToshow={1}
						sliderToScroll={1}
					>
						{images.map((v) => {
							return (
								<ImgWrapper>
									<img src={v.src} />
								</ImgWrapper>
							)
						})}
					</Slick>
					<Indicator>
						<div>
							{currentSlide + 1} / {images.length}
						</div>
					</Indicator>
				</div>
			</SlickWrapper>
		</Overlay>
		</>
	);
};


export default ImagesZoom;