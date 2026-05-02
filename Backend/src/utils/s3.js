import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Upload file to S3
export const uploadToS3 = async (file, folder = 'materials') => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL omitted — objects are private by default in S3
    };

    const result = await s3.upload(params).promise();
    
    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
    };
  } catch (error) {
    console.error('❌ S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

// Delete file from S3
export const deleteFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    };

    await s3.deleteObject(params).promise();
    console.log('🗑️ File deleted from S3:', fileKey);
  } catch (error) {
    console.error('❌ S3 delete error:', error);
    throw new Error('File deletion failed');
  }
};

// Generate signed URL for downloading (valid for 1 hour)
export const getSignedUrl = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
      Expires: 3600, // URL expires in 1 hour
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('❌ Signed URL error:', error);
    throw new Error('Failed to generate download URL');
  }
};

// Validate file before upload
export const validateFile = (file) => {
  const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 1073741824; // 1GB default

  // Check file size
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds maximum allowed (${MAX_SIZE / (1024 * 1024)}MB)`);
  }

  // Allowed file types
  const allowedTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Video
    'video/mp4',
    'video/avi',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/mp3',
    // Archives
    'application/zip',
    'application/x-zip-compressed',
    // Code files
    'application/json',
    'text/csv',
    'text/plain',
    'application/sql',
    'text/x-python',
    'text/javascript',
    'text/x-java-source',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('File type not allowed');
  }

  return true;
};

export default { uploadToS3, deleteFromS3, getSignedUrl, validateFile };
