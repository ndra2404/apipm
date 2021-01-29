const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

/**
 * Upload file to S3 bucket
 *
 * @param {string} filepath - Source file
 * @param {string} filename - Destination file
 */
const uploads3 = (filepath, filename) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'mst-hcms',
    Body: fs.createReadStream(filepath),
    Key: 'attachments/leave/' + filename
  };
  s3.upload(params, function(err, data) {
    if (err) {
      console.log('Upload S3 error', err);
    }
    if (data) {
      console.log('Uploaded in:', data.Location);
    }
  });
};

module.exports = { uploads3 };
