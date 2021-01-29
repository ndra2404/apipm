const ftp = require('basic-ftp');
const fs = require('fs');

/**
 * Get a file from FTP server
 * 
 * @param {string} filepath - The file path 
 */
const get = async filepath => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS
    });
    const path = filepath.split('/');
    const filename = path[path.length - 1];
    const dest = '/tmp/' + filename;
    const stream = fs.createWriteStream(dest);
    return await client
      .download(stream, filepath)
      .then(response => {
        return { file: dest };
      })
      .catch(err => {
        return { err };
      });
  } catch (err) {
    return { err };
  }
  client.close();
};

/**
 * Put a file to FTP server
 * 
 * @param {*} fileSource 
 * @param {*} fileDestination 
 */
const put = async (fileSource, fileDestination) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS
    });
    await client.upload(fs.createReadStream(fileSource), fileDestination);
  } catch (err) {
    console.log(err);
  }
  client.close();
};

module.exports = { get, put };
