const users = require("../models/users").Users;
const user = require("../models/users").User;
const props = require("../models/properties").Properties;
const notifications = require("../models/users").Notifications;
const helpers = require('../helpers/assorted.helpers');
const globals = require("../helpers/global.params");

const moment = require("moment");

class SMS {
    static async sendSms(property_code, recepients, sms_message, other_info) {
        const options = {
            url: "https://api.africastalking.com/restless/send?username=" + globals.env.SMS_API_USERNAME + "&Apikey=" + globals.env.SMS_API_KEY + "&to=+" + recepients + "&message=" + sms_message,
            method: "GET",
            headers: {
                Accept: "application/json",
                "Accept-Charset": "utf-8",
            },
        };

        if (property_code) {
            let code = await props.owner(property_code);
            let property_owner = await new user(code);

            if(property_owner.user_code){
                if (property_owner.available_sms_units > 2) {
                    let [passed, body] = await helpers.axios_request(options);                   
                    if(passed){
                        if (body.toString().includes("requirement failed")) {
                            this.addFailedNotification(other_info);
                        } else { 
                            var status = body.SMSMessageData.Recipients[0].statusCode;                         
                            if (status == 100 || status == 101 || status == 102) {
                                var parts = body.SMSMessageData.Recipients[0].messageParts || 1;
                                users.deductSmsUnits(property_owner.user_code, parts);
                            }
                            return (status == 100 || status == 101 || status == 102);
                        }
                    }else{
                        this.addFailedNotification(other_info);
                    }
                } else {
                    const out_of_units_sms = "Dear " + property_owner.first_name + ", This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!";
                    //check is has send remidner then send to topup
                    let last_time = await users.lastReminderTime(code);
                    if (last_time) {
                        var a = moment(last_time);
                        var b = moment(moment().format());
                        var diff_hours = b.diff(a, "hours");
                       
                        if (diff_hours >= 3) {
                            var obj = {
                                note_head: "SMS units depleted",
                                note_message: out_of_units_sms,
                                user_code: property_owner.user_code,
                                note_class: "danger",
                                note_icon: "bx bxs-message-alt-x",
                            };
                            notifications.Add(obj);
                           
                            if (property_owner.phone_number && property_owner.phone_verified) {
                                this.sendSms(null, property_owner.phone_number, out_of_units_sms, [], (user_sms_callback) => {}); //send reminder sms to user
                            }
                            var last_info = { user_code: property_owner.user_code };
                            users.insertLastSmsReminderTime(last_info);

                            this.addFailedNotification(other_info);
                        } else {
                            this.addFailedNotification(other_info);
                        }
                    } else {
                        var obj = {
                            note_head: "SMS units depleted",
                            note_message: out_of_units_sms,
                            user_code: property_owner.user_code,
                            note_class: "danger",
                            note_icon: "bx bxs-message-alt-x",
                        };
                        notifications.Add(obj);
                        if (property_owner.phone_number && property_owner.phone_verified) {
                            this.sendSms(null, property_owner.phone_number, out_of_units_sms); //send reminder sms to user
                        }
                        var last_info = { user_code: property_owner.user_code };
                        users.insertLastSmsReminderTime(last_info);
                        this.addFailedNotification(other_info);
                    }
                   
                }
            }else{
                this.addFailedNotification(other_info);
            }           
        } else {
            let [passed, body] = await helpers.axios_request(options);
            if(passed){
                if (body.toString().includes("requirement failed")) {
                    this.addFailedNotification(other_info);
                } else {                  
                    var status = body.SMSMessageData.Recipients[0].statusCode;
                    return (status == 100 || status == 101 || status == 102, other_info);
                }
            }else{
                this.addFailedNotification(other_info);
            }           
        }
    }

    static addFailedNotification(other_info){
        if(other_info){
            var obj = {
                note_head: "SMS Failed",
                note_message: "SMS to " + other_info.first_name + " - " + other_info.phone_number + " of " + other_info.unit_name + ", " + other_info.property_name + " could not be sent!",
                user_code: other_info.user_code,
                note_class: "danger",
                note_icon: "bx bxs-message-rounded",
            };
            notifications.Add(obj);
        }        
    }

    static sendBulkMessage(message, contacts, result){
        
    }
}

module.exports = SMS;
