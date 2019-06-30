const AWS = require('aws-sdk');
const Sharp = require('sharp');
const S3 = new AWS.S3({ region: 'ap-northeast-2' });

exports.handler = async (event, context, callback) => {
	const Bucket = event.Records[0].s3.bucket.name;
	const Key = event.Records[0].s3.object.key;
	const filename = key.split('/')[[key.split('/').length - 1]];
	const ext = Key.split('.')[[Key.split('.').length - 1]];
	console.log(Bucket, Key, filename, ext);
	const requiredFormat = ext === 'jpg' ? 'jpeg' : ext; // jpg를 원래이름 jpeg로 변경

	try{
		const s3Object = await S3.getObject({
			Bucket,
			Key,
		}).promise();
		console.log('original', s3Object.Body.length);

		const resizeImage = await Sharp(s3Object.Body)
			.resize(800, 800, {
				fit: 'inside' // 원본비율 유지
			})
			.toFormat(requiredFormat)
			.toBuffer();
		await S3.putObject({
			Bucket,
			key: `thumb/${filename}`,
			Body: resizeImage,
		}).promise();
		return callback(null, `thumb/${filename}`);
		console.log('put');
	}catch(e){
		console.error(e);
		return callback(e);
	}
};

/*
	Bucket: lambda 가 적용될 버킷이름
	Key: 경로명
	filename: 업로드한 이미지의 파일명
	ext: 업로드한 이미지의 확장자
*/