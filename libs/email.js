const nodemailer = require('nodemailer');

/**
 * Send an email
 * 
 * @param {object} options - Object data of {destination, subject, content} 
 */
const send = async options => {
  return new Promise((resolve, reject) => {
    let transporterConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_GMAIL_USER,
        pass: process.env.EMAIL_GMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    let emailSender = process.env.EMAIL_GMAIL_USER;
    if (process.env.EMAIL_PROVIDER == 'TMT') {
      transporterConfig = {
        host: process.env.EMAIL_TMT_SMTP,
        port: process.env.EMAIL_TMT_PORT
      };
      emailSender = process.env.EMAIL_TMT_USER;
    }
    options.from = emailSender;
    const transporter = nodemailer.createTransport(transporterConfig);
    transporter.sendMail(options, function(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = {
  send
};
