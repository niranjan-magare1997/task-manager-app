const nodemailer = require("nodemailer");
const config = require("../../config/config");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.nodemailer.EMAIL,
    pass: config.nodemailer.PSWD,
  },
});

function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

function sendWelcomEmail(email, name) {
  const mailOptions = {
    from: config.nodemailer.EMAIL,
    to: email,
    subject: "Welcom to Task Management Application",
    text: `Hi ${name}, Welcome to the task management apllication. We are glad to have you here.`,
  };

  sendMail(mailOptions);
}

function sendGoodByEmail(email, name) {
  const mailOptions = {
    from: config.nodemailer.EMAIL,
    to: email,
    subject: "Goodby " + name,
    text: `Team Task Management Application,
            Sorrry to see you go ${name}. We hope to see you back some time soon.
        `,
  };

  sendMail(mailOptions);
}

module.exports = {
  sendWelcomEmail,
  sendGoodByEmail,
};
