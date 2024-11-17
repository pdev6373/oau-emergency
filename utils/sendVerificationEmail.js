const { createTransport } = require('nodemailer');

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: '465',
  auth: {
    user: 'taiwoluborode@gmail.com',
    pass: 'gfvvzocfrsalbrgh',
  },
});

async function sendVerificationEmail({ to, subject, body }) {
  try {
    await transporter.sendMail({
      from: '"OAU Emergency" <adebayoluborode@gmail.com>',
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Error occurred while sending email: ', error);
    throw error;
  }
}

module.exports = sendVerificationEmail;
