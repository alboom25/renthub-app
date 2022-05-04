const express = require("express");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const router = express.Router();
const moment = require("moment");

const users = require("../models/users").Users;
const User = require("../models/users").User;
const notifications = require("../models/users").Notifications;


const helpers = require("../helpers/assorted.helpers");
const validator = require("../libs/validator");
const validation_helper = require("../helpers/validation.helper");
const fs = require("fs");
const path = require("path");

const g_login_id='667591171574-nnfmvkjjjfip5egn9c4sqv08v631u3pj.apps.googleusercontent.com';

const mailer = require("../helpers/mail.sender");
const globals = require('../helpers/global.params');



router.all("*", authenticate, function (req, res, next) {next();});


router.get("/login", function (req, res) {
    res.renderEjs(req, "auth/login", {      
        page_title: "Login",
        g_login_id:g_login_id,
        dest: req.query.dest,
        referal_code: req.query.ref
    });
});

router.get("/register", function (req, res) {
    res.renderEjs(req, "auth/register", {        
        referal_code: req.query.ref,        
        page_title: "Register",
    });
});

router.get("/recover-password", function (req, res) {
    res.renderEjs(req, "auth/recover-password", {        
        page_title: "Recover Password",
    });
});

router.get("/check-mail", async function (req, res, next) {
    if (req.query.user_email) {
        var email = decodeURIComponent(req.query.user_email);
        let r = await users.emailRegistered(email);   
        let rs = r? 'false':'true';
        res.end(r); 
    } else {
        next();
    }
});

router.get("/confirm-email", async function (req, res, next) {
    if (req.query.confirmation) {        
        let r = await users.confirmNewAccount(req.query.confirmation);
        if (r) {
            res.renderEjs(req, "auth/confirm-email", {
                page_title: "Email Confirmation",
                header: "Success!",
                text_class: "text-success",
                message: "Your account email email has been successfully confirmed. Proceed now to login and get started.",
            });
        } else {
            res.renderEjs(req, "auth/confirm-email", {                
                header: "Failed!",
                page_title: "Email Confirmation",
                text_class: "text-warning",
                message: "Unable to confirm your account email. The link is either expired or your account had been confirmed before.",
            });
        }        
    } else {
        next();
    }
});

router.get("/reset-password", async function (req, res, next) {
    if (req.query.reset) {
        let user_code = await users.resetKeyEmail(req.query.reset);
        if(user_code){
            res.renderEjs(req, "auth/reset-password", {
                page_title: "Reset Password",
                reset_key: req.query.reset,               
            });
        }else{
            next();
        }
    } else {
        next();
    }
});

router.post("/reset-password", function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.resetPass());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        bcrypt.genSalt(1, (err, salt) => {
            bcrypt.hash(req.body.user_password, salt, async (err, hash) => {
                if (err) {
                    res.errorEnd("Unable to reset password. Please try again later");
                } else {
                    let user_code = await users.resetKeyEmail(req.body.reset_key);
                    let nuser =  await new User(user_code);
                    nuser.password = hash;
                    nuser.password_reset_key = null;
                    let saved = await nuser.update();
                    if(saved){
                        res.successEnd("Your password has been successfully reset");
                        //send notification
                    }else{
                        res.errorEnd("Unable to reset password. Please try again");
                    }
                }
            });
        });
    }
});

router.post("/recover-password", async function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.recoverPassword());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        res.successEnd("Your request has been received. If your email exists in our system, you will receive reset instructions shortly");
        let code = await users.emailOwner(req.body.useremail);
        if(code){
            var reset_key = uuid.v4();
            let nuser = await new User(code);
            nuser.password_reset_key = reset_key;
            let u = await nuser.update();
            if(u){
                sendPasswordResetEmail(req, req.body.useremail, reset_key, req.transporter);
            }
        }        
    }
});

router.post("/resend-confirmation", async function (req, res) {
    if (req.body.user) {
        var confirmation = uuid.v4();       
        let nuser = await new User(req.body.user);
        nuser.email_confirmation_code = confirmation;
        let u = await nuser.update();
        if(u){
            sendEmailConfirmation(req.__base_url, nuser.email_address, confirmation);
            res.successEnd("A confirmation mail has been sent to your mail. Please check on spam folder if you cannot find it in your inbox.");
        }else{
            res.errorEnd("Unable to process your request. Your email may have been verified");
        }            
    } else {
        res.errorEnd("Unable to process your request");
    }
});

router.post("/register", function (req, res) {
    //validate captcha
    var validate = validator.Validate(req.body, validation_helper.newUser());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {       
        var email_confirmation_code = uuid.v4();
        var dt = moment().add(24, 'hours').format();       
        bcrypt.genSalt(1, (err, salt) => {
            bcrypt.hash(req.body.user_password, salt, async (err, hash) => {
                if (err) {
                    logger.error(err);
                }
                var color = "#" + Math.random().toString(14).substr(5, 6);
                var username = helpers.generate_random_lower(12);
                var email = req.body.user_email.toLowerCase();
                var obj = {
                    first_name: helpers.titleCase(req.body.first_name),
                    last_name: helpers.titleCase(req.body.last_name),                  
                    username: username,
                    email_address: email,
                    avatar_color: color,
                    password: hash,
                    email_confirmation_code: email_confirmation_code,
                    email_confirmation_code_expiry: dt,
                    referal_code: req.body.referal_code.toUpperCase(),
                };

                let nuser = await new User();
                Object.assign(nuser, obj); 

                let pass = await nuser.save();
                if(pass){
                    sendEmailConfirmation(req.__base_url, nuser.email_address, nuser.email_confirmation_code);
                    res.successEnd("New account has been created. A confirmation has been set to your mail. Please confirm to proceed.\n Note: Check on spam folder if you cannot find the mail in your inbox");
                    var mail_obj = {
                        note_head: "Account Created",
                        note_message: "New account has been created. We are excited that you've joined us. If you need any assitance, kindly contact us. We are ready to help.",
                        user_code: nuser.user_code,
                        note_class: "success",
                        note_icon: "bx bxs-user-plus",
                    };
                    notifications.Add(mail_obj);
                }else{
                    res.errorEnd("Unable to create an account. Please try again later");
                }
            });
        });
    }
});

router.post('/google-login', async function(req, res) {    
    let tk = parseJwt(req.body.token);
    
    if(g_login_id == tk.aud){
        
        let code = await users.emailOwner(tk.email);  
           
        var device = helpers.browserName(req.headers['user-agent'])
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress||""; 
        ip = ip.replace("::ffff:",'');
        var login_info={            
            entry_date: moment().format(),
            ip_address: ip,
            browser_name: device.browser,
            operating_system: device.os
        };
       
        if(code){
            let user_object = await new User(code);    
            login_info.user_code = user_object.user_code;           

            if (!user_object.account_active) {
                res.errorEnd("Sorry, your account is disabled. Please contact support for assistance");
            } else {
                req.session.logged_in = true;
                req.session.user_code = user_object.user_code;
                req.session.user_locked = false;                
                var ua = req.headers['user-agent'];
                var msg = "/";
                
                if (req.body.dest) {
                    msg = Buffer.from(req.body.dest, "base64").toString();
                }
                login_info.logged_in=true;
                res.successEnd(msg);
                users.registerUserLogin(login_info);
            }
        }else{
            var color = "#" + Math.random().toString(14).substr(5, 6);
            var username = helpers.generate_random_lower(12);
            var email = tk.email;
            var obj = {
                first_name: helpers.titleCase(tk.given_name),
                last_name: helpers.titleCase(tk.family_name),                  
                username: username,
                email_address: email,
                avatar_color: color,
                password: tk.jti,
                email_verified: tk.email_verified,
                avatar_path: tk.picture,
                password_set: 0,
                referal_code: req.body.referal_code.toUpperCase(),
            };

            let nuser = await new User();
            Object.assign(nuser, obj); 

            let pass = await nuser.save();
            if(pass){        
                req.session.logged_in = true;
                req.session.user_code = nuser.user_code;
                req.session.user_locked = false;     
                if (req.body.remember_me) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
                } else {
                    req.session.cookie.expires = false; // Cookie expires at end of session
                }           
                var ua = req.headers['user-agent'];
                var msg = "/";
                if (req.body.dest) {
                    msg = Buffer.from(req.body.dest, "base64").toString();
                }
                login_info.user_code = nuser.user_code;
                login_info.logged_in=true;
                
                
                res.successEnd(msg);
                users.registerUserLogin(login_info);

                var mail_obj = {
                    note_head: "Account Created",
                    note_message: "New account has been created. We are excited that you've joined us. If you need any assitance, kindly contact us. We are ready to help.",
                    user_code: nuser.user_code,
                    note_class: "success",
                    note_icon: "bx bxs-user-plus",
                };
                notifications.Add(mail_obj);
            }else{
                res.errorEnd("Unable to create an account. Please try again later");
            }
        }

    }else{
        res.errorEnd('Cannot sign in using google right now. Please try gain later!');
    }    
});

function parseJwt (token) {       
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
    return decodedData;
}

router.post("/login", async function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.Login());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        let user_code = await users.get_single(req.body.username);
        if(user_code){
            let user_object = await new User(user_code);
            if (user_object.email_verified) {
                bcrypt.compare(req.body.userpassword, user_object.password).then((is_match) => {
                    var device = helpers.browserName(req.headers['user-agent'])
                    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress||""; 
                    ip = ip.replace("::ffff:",'');
                    var login_info={
                        user_code: user_object.user_code,
                        entry_date: moment().format(),
                        ip_address: ip,
                        browser_name: device.browser,
                        operating_system: device.os
                    };

                    if (is_match) { 
                        if (!user_object.account_active) {
                            res.errorEnd("Sorry, your account is disabled. Please contact support for assistance");
                        } else {
                            req.session.logged_in = true;
                            req.session.user_code = user_object.user_code;
                            req.session.user_locked = false;
                            if (req.body.remember_me) {
                                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
                            } else {
                                req.session.cookie.expires = false; // Cookie expires at end of session
                            }
                            var ua = req.headers['user-agent'];
                           

                            var msg = "/";
                            if (req.body.dest) {
                                msg = Buffer.from(req.body.dest, "base64").toString();
                            }
                            login_info.logged_in=true;
                            res.successEnd(msg);
                            users.registerUserLogin(login_info);
                        }
                    } else {
                        res.errorEnd("Invalid email/phone or password");
                        login_info.logged_in=false;     
                        users.registerUserLogin(login_info);                      
                        //invalid password, if 5 times in a row send a notification to owner
                    }
                });
            } else {
                var msg = "Your account email is not verified. <cutton type='button' class='btn btn-danger mt-2 btn-sm' onclick=\"resendConfirmation('" + user_object.user_code + "')\" >Resend Confirmation</button>";
                res.errorEnd(msg);
            }
        }else{
            res.errorEnd("Invalid email/phone/username or password");
        }       
    }
});

function sendEmailConfirmation(base_url, email_address, confirmation_code) {
    var temp_path = path.join(globals.views_dir, "templates", "account_confirmation.html");

    fs.readFile(temp_path, "utf8", function (err, fd) {
        if (err) {
            logger.error(err);
        } else {
            var mail_text = fd.toString();
            const search = "{confirmation_url}";
            const replacer = new RegExp(search, "g");

            var follow_url = base_url + "/auth/confirm-email?confirmation=" + confirmation_code;
            var final = mail_text.replace(replacer, follow_url);
         
            const mailData = {            
                to: email_address,
                subject: "Confirm your account registration",
                text: "Open the following link to confirm " + follow_url,
                html: final,
            };
            mailer.sendMail(mailData);           
        }
    });
}

function sendPasswordResetEmail(req, email_address, reset_key) {
    var temp_path = path.join(globals.views_dir, "templates", "reset_password.html");

    fs.readFile(temp_path, "utf8", function (err, fd) {
        if (err) {
           // logger.error(err);
        } else {
            var mail_text = fd.toString();
            const search = "{password_reset_url}";
            const replacer = new RegExp(search, "g");

            var follow_url = req.__base_url + "/auth/reset-password?reset=" + reset_key;
            var final = mail_text.replace(replacer, follow_url);
            const mailData = {            
                to: email_address,
                subject: "Password Reset",
                text: "Open the following link to reset your password " + follow_url,
                html: final,
            };
            mailer.sendMail(mailData);        
        }
    });
}

async function authenticate(req, res, next) {  	
    if(req.session.logged_in) {      
        if(req.method === "GET") {
            res.redirect("/");
        } else {
            res.errorEnd("Action not allowed!");
        }
	} else {         
        next();	
	}
}

module.exports = router;
