const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const Users = require("../models/users").Users;
const user = require("../models/users").User;
const notifications = require("../models/users").Notifications;

const helpers = require("../helpers/assorted.helpers");
const globals = require("../helpers/global.params");
const file_helpers = require("../helpers/file.helpers");
const validator = require("../libs/validator");
const validation_helper = require("../helpers/validation.helper");
const sms = require("../libs/sms.sender");
const mpesa = require("../libs/mpesa");
const moment = require("moment");

router.get("/profile", function(req, res) {
	res.renderEjs(req, "user/profile", {		
		page_title: "Account Settings",
		sub_header: "Edit Profile",		
	});
});

router.get("/check-username", function(req, res) {
	var username = decodeURIComponent(req.query.username) || "";
	user.usernameAvailable(username, req.session.user_code, (pass) => {		
		res.json(pass);
	});
});

router.get("/notifications", function(req, res) {
	res.renderEjs(req, "user/notifications", {		
		page_title: "Notifications",
		sub_header: "Notifications",		
	});
});

router.post("/user-phone-info", async function(req, res) {
    let profile = await new user(req.session.user_code);
	var out_info = "";
    if (profile.phone_number) {
        if (profile.phone_verified) {
            out_info = `<p class="text-success mb-1">${profile.phone_number}</p><button type="button" class="btn btn-warning btn-sm" onclick="linkPhone()"> Change Phone </button>`;
        } else {
            out_info = `<p class="text-muted mb-1">${profile.phone_number}</p><button type="button" class="btn btn-warning btn-sm" onclick="verifyPhoneOtp()"> Verify Phone </button>`;
        }
    } else {
        out_info = '<button type="button" class="btn btn-warning btn-sm mt-2" onclick="linkPhone()"> Link Phone </button>';
    }
    res.successEnd(out_info);
});

router.post("/profile", async function(req, res) {
	switch (req.query.section) {
		case 'profile':
			var validate = validator.Validate(req.body, validation_helper.userProfile());
			if (validate.has_errors) {
				res.errorEnd(validate.validation_errors.join("<br>"));
			} else {
				var company_name = req.body.company_name || '';
				var other_names = req.body.other_names || '';

				let last_edit = await Users.lastEdit(req.session.user_code);

				var a = moment(last_edit);
				var b = moment(moment().format());
				var diff_days = b.diff(a, 'days');
				if (diff_days < 30) {
					res.errorEnd("You will be able update your details after " + (30 - diff_days) + " days");
				} else {
					var obj = {
						address: req.body.address,
						first_name: helpers.titleCase(req.body.first_name),
						last_name: helpers.titleCase(req.body.last_name),
						other_names: helpers.titleCase(other_names),
						company_name: company_name.toUpperCase(),
					};

					let profile = await new user(req.session.user_code);
					var data2 = {
						first_name: profile.first_name,
						last_name: profile.last_name,
						other_names: profile.other_names,
						company_name: profile.company_name,
						edit_date: moment().format(),
						user_code: req.session.user_code
					};

					Object.assign(profile, obj);
					let updated = await profile.update();

					if (updated) {
						res.successEnd("Profile information has been updated");
						var data = {
							user_code: req.session.user_code,
							last_edit_time: moment().format()
						};
						Users.updateLastEdit(data);

						Users.logUserNamesChange(data2);
					} else {
						res.errorEnd("Unable to update profile information");
					}
				}
			}
			break;
		case 'account':
			var validate = validator.Validate(req.body, validation_helper.accountEdits());
			if (validate.has_errors) {
				res.errorEnd(validate.validation_errors.join("<br>"));
			} else {
				let last_edit = await Users.lastEdit(req.session.user_code);

				var a = moment(last_edit);
				var b = moment(moment().format());
				var diff_days = b.diff(a, 'days');
				if (diff_days < 30) {
					res.errorEnd("You will be able update your account details after " + (30 - diff_days) + " days");
				} else {
					var username = decodeURIComponent(req.query.username);
                    let passed = Users.usernameAvailable(username, req.session.user_code);
                   
                    if (passed) {                     
                        let usr = await new user(req.session.user_code);
                        usr.username = req.body.username;
                        let updated = await usr.update();
                        if (updated) {
                            res.successEnd("Account information has been updated");
                            var data = {
                                user_code: req.session.user_code,
                                last_edit_time: moment().format()
                            };
                            Users.updateLastEdit(data);
                        } else {
                            res.errorEnd("Unable to update account information. Please try again later");
                        }
                    } else {
                        res.errorEnd("Username not available to use");
                    }                   			
				}
			}
			break;
		case 'password':
			if (req.body.old_password && req.body.new_password && req.body.confirm_password) {
				bcrypt.compare(req.body.old_password, req.user_profile.password).then((compare_result) => {
					if (compare_result == true) {
						bcrypt.genSalt(1, (err, salt) => {
							bcrypt.hash(req.body.new_password, salt, async (err, hash) => {
								if (err) {
									res.errorEnd("Unable to reset password. Please try again");
								} else {								
                                    let profile = await new user(req.session.user_code);
                                    profile.password = hash;
                                    let updated = await profile.update();
									if (updated) {
                                        res.successEnd("You password has been changed");
                                        //send sms if verified
                                        //add notification
                                    } else {
                                        res.errorEnd("Unable to change password. Please try again!");
                                    }
								}
							});
						});
					} else {
						res.errorEnd("Wrong current password provided");
					}
				});

			} else {
				res.errorEnd("Please provide your old password, new password and repeat");
			}
			break;
		case 'update-phone':
			if (req.body.phone_number.length > 1) {
				var valid_phone = req.body.phone_number.length == 10 || req.body.phone_number == 12;
				if (!valid_phone) {
					return res.errorEnd("Invalid phone number provided");
				}
			}
			var phone_number = req.body.phone_number || "";
			var otp = helpers.generate_random_number(4);
			otp = otp.toString();

			var obj = {
				phone_number: phone_number,
				phone_verified: false,
				phone_otp: otp,
				phone_otp_time: moment().format()
			};
			
            let usr = await new user(req.session.user_code);
            Object.assign(usr, obj);
            let updated = await usr.update();
            if (updated) {                
                if (phone_number.length > 1) {
                    var sms_message = "Dear " + req.user_profile.first_name + ". Please enter " + otp + " to complete linking your number to Rent Hub. Safely ignore this message if you did not request this.";

                    sms.sendSms(null, phone_number, sms_message, []);
                    let result_object = {
                        phone_updated: true,
                        message: "Please enter an OTP that has been sent to your phone"
                    };
                    res.successEnd(result_object);
                 
                } else {
                    result_object = {
                        phone_updated: false,
                        message: "Your phone number has been not been updated. Please try again later."
                    };
                    res.successEnd(result_object);
                }
            } else {
                res.errorEnd("Unable to add phone number. Please try again later");
            }
			break;
		case 'resend-otp':
            let profile = await new user(req.session.user_code);
			var a = moment(profile.phone_otp_time);
				var b = moment(moment().format());
				var diff_seconds = b.diff(a, 'seconds');
				if (diff_seconds > 180) {
					var otp = helpers.generate_random_number(4);
					otp = otp.toString();

					var obj = {
						phone_verified: false,
						phone_otp: otp,
						phone_otp_time: moment().format()
					};				
                    Object.assign(profile, obj);
                    let updated = await profile.update();
					if (updated) {
                        var sms_message = "Dear " + profile.first_name + ". Please enter " + otp + " to complete linking your number to Rent Hub. Safely ignore this message if you did not request this.";
                        sms.sendSms(null, profile.phone_number, sms_message, []);
                        res.successEnd("A new OTP has been resent to your phone");
                    } else {
                        res.errorEnd("Unable to resend the OTP. Please try again later");
                    }
				} else {
					res.errorEnd("Please wait for at least 2 minutes before requesting for a new OTP");
				}

			break;

		case 'confirm-otp':
            let oprofile = await new user(req.session.user_code);

			if (oprofile.phone_verified) {
                res.errorEnd("Phone number already verified");
            } else {
                var otp = req.body.otp || "";
                if (otp.length == 4) {
                    var a = moment(oprofile.phone_otp_time);
                    var b = moment(moment().format());
                    var diff_seconds = b.diff(a, 'seconds');
                    if (diff_seconds > 180) {
                        res.errorEnd("The provided OTP is invalid or expired. Please request for a new one!");
                    } else if (otp == oprofile.phone_otp) {
                        var obj = {
                            phone_verified: true,
                            phone_otp: "",
                            phone_otp_time: null
                        };
                        Object.assign(oprofile, obj);
                        let updated = await oprofile.update();
                        if (updated) {
                            res.successEnd("Your phone number has been confirmed!");
                            var sms_message = "Your phone number has been linked to your account at Rent Hub."
                            sms.sendSms(null, oprofile.phone_number, sms_message, []);
                            Users.unlinkPhoneOthers(oprofile.phone_number, req.session.user_code);
                        } else {
                            res.errorEnd("Unable to confirm your OTP. Please try again later.");
                        }
                    } else {
                        res.errorEnd("The provided OTP is not correct!");
                    }
                } else {
                    res.errorEnd("The provided OTP is invalid!");
                }
            }
			break;
		case 'purchase-sms-units':
			var sms_units = req.body.units
			var sms_phone = req.body.phone_number;

			if (sms_units > 9) {
				if (sms_phone.length == 10 || sms_phone.length == 12) {
                    let oprofile = await new user(req.session.user_code);

					if (oprofile.phone_verified) {
                        var pdata = {
                            PhoneNumber: sms_phone,
                            Description: "Online buy sms units",
                            Reference: oprofile.phone_number,
                            Amount: sms_units
                        };
                        mpesa.processPayment(pdata, (result) => {
                            if (result.passed) {
                                res.successEnd(result.message);
                            } else {
                                res.errorEnd(result.message);
                            }
                        });
                    } else {
                        res.errorEnd("Please link and confirm your phone number first!");
                    }

				} else {
					res.errorEnd("Please enter a correct phone number ie 07XXXXXXXX or 2547XXXXXXXX!");
				}
			} else {
				res.errorEnd("Minimum SMS units to purchase are 10!");
			}
			break;
		case 'get-sms-balances':
            let nprofile = await new user(req.session.user_code);
			res.successEnd(nprofile.available_sms_units);
			break;
		case 'lock-user':
			req.session.user_locked = true;
			res.successEnd("User session locked");
			break;
		default:
			res.errorEnd("Invalid request");
	}
});

router.post("/update-profile-image", async function(req, res) {
	if (req.body.profile_image) {
		var data = Buffer.from(req.body.profile_image, "base64");
		var filename = uuid.v4();
		filename += ".jpg";
        
		var fl = path.join(globals.private_dir, "users", filename);

        let created = await file_helpers.createFile(data, fl);
        if (created) {
            let user_profile = await new user(req.session.user_code);
            let fl1 = user_profile.avatar_path;
            user_profile.avatar_path = fl;
            let updated = await user_profile.update();
            if (updated) {
                res.successEnd("Profile picture has been updated");
                file_helpers.delete_file(fl1);               
            } else {
                res.errorEnd("Unable to update profile image");
                file_helpers.delete_file(fl);
            }
        } else {
            res.errorEnd("Unable to update profile image");
        }
	} else {
		res.errorEnd("Image is missing");
	}
});

router.post("/reset-profile-image", async function(req, res) {
    let user_profile = await new user(req.session.user_code);
    user_profile.avatar_path = '';
    let updated = await user_profile.update();
    if (updated) {
        file_helpers.delete_file(user_profile.avatar_path);
        res.successEnd("Profile image has been reset");
    } else {
        res.errorEnd("Unable to reset profile image");
    }
});

router.post("/get-notifications", async function(req, res) {
	let notes = await notifications.get(req.session.user_code);
    res.successEndData(notes);
});

router.post("/refresh-notifications", async function(req, res) {
	var last_note = req.body.last_note || 0;
	let notes = await notifications.new(req.session.user_code, last_note);
    res.successEndData(notes);
});

router.post("/delete-notification", async (req, res) => {
	var note_id = req.body.note_id || "";
	let note_deleted = await notifications.delete_entry(note_id, req.session.user_code);
	if (note_deleted) {
        res.successEnd("Deleted");
    } else {
        res.errorEnd("Not Deleted");
    }
});

router.post("/get-more-notifications", async function(req, res) {
	if (req.body.last_note) {
		let notes = await notifications.load(req.session.user_code, req.body.last_note);
        res.successEndData(notes);
	} else {
		res.successEndData([]);
	}
});

router.post("/get-unread-notifications", async function(req, res) {
	let notes = await notifications.unread(req.session.user_code);		
	res.successEnd({unread_notes: notes});
});

router.post("/read-notification", async function(req, res) {
	var note_id = req.body.note_id || "";
	let note_read = await notifications.read(note_id, req.session.user_code);
    if (note_read) {
        res.successEnd("Read");
    } else {
        res.errorEnd("Not read");
    }
});

router.post("/read-all-notifications", async function(req, res) {
	let note_read = await notifications.readAll(req.session.user_code);
    if (note_read) {
        res.successEnd("Read");
    } else {
        res.errorEnd("Not read");
    }
});

router.post("/close-tour", async function(req, res) {
	let ok = await Users.closeTour(req.session.user_code);
	if(ok){
		res.successEnd(ok);
	}else{
		res.errorEnd(ok);
	}	
});

router.post("/prompt-landlord", async function(req, res) {
	let cc = await Users.landlordRequests(req.session.user_code);
	if(cc){		
		res.errorEnd("You already submitted a request to be a property owner. Please wait while the request is being processed.");
		await Users.landlordPrompt(req.session.user_code);
	}else{
		let ok = await Users.landlordPrompt(req.session.user_code);
		if(ok){
			res.successEnd(ok);
			if(req.body.sub){
				let data = {
					user_code: req.session.user_code
				};
				let ok2 = await Users.requestLandlord(data); 
			}
		}else{
			res.errorEnd(ok);
		}	
	}	
});

router.post("/toggle-landlord", async function(req, res) {
	if (req.user_profile.has_properties) {
		res.errorEnd("Cannot change status. Already has associated property.");
	} else {
		var t = !req.user_profile.is_landlord;		
        let profile = await new user(req.session.user_code);
        profile.is_landlord = t;
        let updated = await profile.update();

        if (updated) {
            if (t) {
                var obj = {
                    note_head: "Landlord Activated",
                    note_message: "Your account landlord mode has been activated. You can now add your properties by clicking on 'Landlord'>'My Properties'. If you erroneously opted in you can safely opt out by click on your profile at the to right then 'Landlord (Opt-Out)'",
                    user_code: req.session.user_code,
                    note_class: "success",
                    note_icon: "bx bx-cog",
                };
                //notifications.Add(obj);
            }
            res.successEnd("User status has been updated");
        } else {
            res.errorEnd("Unable to change status");
        }
	}
});

module.exports = router;