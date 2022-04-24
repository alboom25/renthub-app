const nodemailer = require('nodemailer');
const globals = require('../helpers/global.params');
const logger = require('../libs/logger');

const transporter = nodemailer.createTransport({
    port: globals.env.SMTP_SERVICE_PORT,
    host: globals.env.SMTP_SERVICE_HOST,
    auth: {
        user: globals.env.SMTP_USER_NAME,
        pass: globals.env.SMTP_USER_PASSWORD,
    },
    secure: globals.env.SMTP_SERVICE_SECURE,
});

class Mailer{
    static sendMail(mail_object) {
        mail_object.from= transporter.options.auth.user;
        transporter.sendMail(mail_object, function (err, info) {
            if (err) {
                logger.log(err);
            }
        });
    }

}

module.exports = Mailer;