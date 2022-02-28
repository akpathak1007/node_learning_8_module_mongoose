const mailer = require('nodemailer');
const { readFile } = require('fs/promises');

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
const sendEmail = async (options) => {
  /* Sending mail with transporter object */
  let info = await transporter.sendMail({
    from: 'Anuj Pathak <me@mycompany.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  return info;
};
/**
 * ? Forget password email
 */
exports.forgetPassword = async (options) => {
  let template = await readFile(
    './resource/templates/forget-password.html',
    'utf-8'
  );
  const url = process.env.URL.concat(`/overview.html/${options.resetToken}`)
  console.log(url);
  template = template.replace('{{$name}}', options.name);
  template = template.replace('{{$url}}', url);
  const result = await sendEmail({
    to: options.to,
    subject: 'Natours Forget Password',
    text: '',
    html: template,
  });
  return result;
};
// module.exports = sendEmail;
