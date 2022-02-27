const mailer = require('nodemailer');


/* Transporter object */
const config = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};
const transporter = mailer.createTransport(config);

/**
 * Pass options object as an argument containing properies to, subject, text, html
 * @param options
 */
module.exports = async (options) => {
  /* Sending mail with transporter object */
  let info = await transporter.sendMail({
    from: 'Anuj Pathak <me@mycompany.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};
