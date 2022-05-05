const Events = require('events');
const { readFile } = require('fs/promises')

const sendEmail = require('../utils/send-email');


const emailEventEmitter = new Events;
emailEventEmitter.on('forget-password', async (options) => {
    const template = await readFile(
      './resource/templates/forget-password.html',
      'utf-8'
    );
    await sendEmail({
      to: options.to,
      subject: 'Natours Forget Password',
      text: '',
      html: template,
    });
    return true;
});


module.exports = emailEventEmitter;
// 9412596470