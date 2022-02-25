const mailer = require('nodemailer');
/* Transporter object */
const transporter = mailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_IS_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = async (options) => {
  /* Sending mail with transporter object */
  let info = await transporter.sendMail({
    from: 'Midnal sharma <me@mycompany.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};
