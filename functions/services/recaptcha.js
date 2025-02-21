const request = require("request-promise");
const nodemailer = require("nodemailer");
const validator = require("./validator");
const mailchimp = require("./mailchimp");

const checkRecaptcha = (event) => {
  return new Promise((resolve, reject) => {
    request({
      url: "https://www.google.com/recaptcha/api/siteverify",
      method: "POST",
      json: true,
      form: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: event.body._recaptcha,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((json) => {
        if (json.success) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            message: "ReCAPTCHA did not validate",
          });
        }
      })
      .catch(() => {
        resolve({
          success: false,
          message: "ReCAPTCHA did not validate",
        });
      });
  });
};
const postFormMessage = (event) => {
  return new Promise((resolve, reject) => {
    validator
      .validateRequest(event)
      .then(() => {
        // Send an email to Kelly
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Normalize email properties
        const to = process.env.EMAIL_USER;
        const from = event.body._form.email.value;
        const sender = event.body._form.email.value;
        const replyTo = event.body._form.email.value;
        const subject = `WordsUp Website ${event.body._action} Form`;
        const text = `
Name:
${event.body._form.name.value}

Email:
${event.body._form.email.value}

Message:
${event.body._form.message.value}

Click "Reply" to respond to ${event.body._form.email.value}
            `;

        transporter.sendMail(
          {
            from,
            to,
            sender,
            replyTo,
            subject,
            text,
          },
          (error, info) => {
            if (!error) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                message: "Nodemailer could not send email",
              });
            }
          },
        );
      })
      .catch(() => {
        resolve({
          success: false,
          message: "Form fields did not validate",
        });
      });
  });
};

module.exports = {
  exec(event) {
    return new Promise((resolve, reject) => {
      if (
        event.body._action === "Contact" ||
        event.body._action === "Coaching"
      ) {
        checkRecaptcha(event).then((check) => {
          if (check.success) {
            postFormMessage(event).then((response) => {
              resolve(response);
            });
          } else {
            resolve(check);
          }
        });
      } else if (event.body._action === "Special-Offer") {
        checkRecaptcha(event).then((check) => {
          if (check.success) {
            validator
              .validateRequest(event)
              .then(() => {
                mailchimp.optin(event).then((response) => {
                  resolve(response);
                });
              })
              .catch(() => {
                resolve({
                  success: false,
                  message: "Form fields did not validate",
                });
              });
          } else {
            resolve(check);
          }
        });
      }
    });
  },
};
