const request = require("request");
const moment = require("moment");

const validation_key = "71a66279848887bbedebbb2626f85ebf07fc4104";
const consumer_key = "ljQi5iKvKiwnCu8nAAKH5ONwJ0qslEmO";
const consumer_secret = "sqpXxoY7ZG5IsTNi";
const ShortCode = 174379;
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const is_production = false;
const globals = require("../helpers/global.params");

let trx_time = "";
const onine_paybill=true; //onine_paybill

const company_api_data = function(result) {       
    var data = [];
    let raw_data = consumer_key + ":" + consumer_secret;
    let buff = new Buffer.from(raw_data);
    let b64_creds = buff.toString("base64");
    trx_time = moment().format("YYYYMMDDHHmmss");
    raw_data = ShortCode + passkey + trx_time;
    buff = new Buffer.from(raw_data);
    let b64_pass = buff.toString("base64");

    data["consumer_key"] = consumer_key;
    data["consumer_secret"] = consumer_secret;

    data["token_url"] =token_url(is_production);
    data["stk_url"] =stk_push_url(is_production);
    data["password"] = b64_pass;
    data["short_code"] = ShortCode;
    data["call_back"] =base_url("8ckqrhxjopiy7z1w/payment-received?token=" + validation_key);
    data["validation_url"] =base_url("8ckqrhxjopiy7z1w/action-required?token=" + validation_key);
    data["register_url"] =registration_url(is_production);

   generateAccessToken(b64_creds, is_production, (access_token) => {
        data["access_token"] = access_token;
        result(data);
    });
}

let base_url = function(str) {        
    //globals.env.BASE_URL.toString() +
  return ("https://example.com/" + str+"&push="+passkey).toString().trim();       
}

let stk_push_url = function(is_production) {
    if (is_production) {
        return "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    } else {
        return "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    }
}

let token_url = function(is_production) {
    return is_production ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
}

let registration_url = function(is_production) {
    if (is_production) {
        return "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    } else {
        return "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    }
}

let online_paybill_url = function(is_production) {
    if (is_production) {
        return "https://api.safaricom.co.ke/mpesa/c2b/v1/simulate";
    } else {
        return "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
    }
}

let generateAccessToken = function(credentials, is_production, access_token) {
    var url =token_url(is_production);
    const options = {
        url: url,
        method: "GET",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "utf-8",
            Authorization: "Basic " + credentials,
        },
    };    
    request(options, function (err, res, body) {
        if (err) {
            access_token("");
        } else {               
            if (body.includes("errorCode")) {
                access_token("");
            } else {                   
                access_token(JSON.parse(body).access_token ||"");                   
            }
        }
    });
}

let CustomerPayBillOnline = function(post_data, access_token, stk_url, feedback){
    const options = {
        url: stk_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "utf-8",
            Authorization: "Bearer " + access_token,
        },
        json: post_data,
    };
    request(options, function (err, res, body) {          
        if (err) {
           //console.log(err)
            feedback(true, "Unable to process the payment request! Pease try again later.", null);
        } else {   
            if (body.errorCode == null) {
                feedback(true, body.CheckoutRequestID, body.MerchantRequestID);
            } else {
                feedback(false, body.errorMessage, null);
            }
        }
    });
}

let stk_push = function(post_data, access_token, stk_url, feedback) {
    const options = {
        url: stk_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "utf-8",
            Authorization: "Bearer " + access_token,
        },
        json: post_data,
    };
    request(options, function (err, res, body) {          
        if (err) {
            feedback(true, "Unable to process the payment request!", null);
        } else {  
            if (body.errorCode == null) {
                feedback(true, body.CheckoutRequestID, body.MerchantRequestID);
            } else {
                feedback(false, body.errorMessage, null);
            }
        }
    });
}

let processPayment = function(payment_data){
    return new Promise(function(resolve, reject){
        var PhoneNumber = payment_data.PhoneNumber;

       company_api_data((api_data) => {
            if (PhoneNumber[0] == "0" && PhoneNumber.length == 10) {
                PhoneNumber = "254" + PhoneNumber.substring(1, PhoneNumber.length);
            } else if (PhoneNumber.length == 9) {
                PhoneNumber = "254" + PhoneNumber;
            }
            var post_data = {
                BusinessShortCode: api_data["short_code"],
                Password: api_data["password"],
                Timestamp: trx_time,
                TransactionType: "CustomerPayBillOnline",
                Amount: payment_data.Amount,
                PartyA: PhoneNumber,
                PartyB: api_data["short_code"],
                PhoneNumber: PhoneNumber,
                CallBackURL: api_data["call_back"],
                AccountReference: payment_data.Reference,
                TransactionDesc: payment_data.Description,
            };           
            var pb_data={
                'ShortCode':ShortCode,
                'CommandID':'CustomerPayBillOnline',
                'Amount': payment_data.Amount,
                'Msisdn': PhoneNumber,
                'BillRefNumber':payment_data.Reference
            };          

            if(onine_paybill){
               stk_push(post_data, api_data["access_token"], api_data["stk_url"], (stk_passed, val1, val2) => {
                    if (stk_passed) {
                        var dt = {
                            MerchantRequestID: val2,
                            CheckoutRequestID: val1,
                        };
                        var mres = {
                            passed:true,
                            message:"The request has been procesed. enter your MPESA PIN on your phone now."
                        };
                        resolve(mres);                 
                    } else {
                        var mres = {
                            passed:false,
                            message:"Unable to complete request! " + val1
                        };
                        resolve(mres);                            
                    }
                });
            }else{
               CustomerPayBillOnline(pb_data, api_data["access_token"],online_paybill_url(is_production), (stk_passed, val1, val2)=>{
                    if (stk_passed) {
                        var dt = {
                            MerchantRequestID: val2,
                            CheckoutRequestID: val1,
                        };
                        var mres = {
                            passed:true,
                            message:"The request has been procesed. enter your MPESA PIN on your phone now."
                        };
                        resolve(mres);                 
                    } else {
                        var mres = {
                            passed:false,
                            message:"Unable to complete request! " + val1
                        };
                        resolve(mres);                        
                    }
                });
            }

           
        });
    });       
}

let registerLinks = function(result){
    let raw_data = consumer_key + ":" + consumer_secret;
    let buff = new Buffer.from(raw_data);
    let b64_creds = buff.toString("base64");        
    trx_time = moment().format("YYYYMMDDHHmmss");  
    
    const post_data={
        ShortCode: ShortCode,
        ResponseType:'Success',
        ConfirmationURL:base_url("8ckqrhxjopiy7z1w/payment-received?token=" + validation_key),
        ValidationURL:base_url("8ckqrhxjopiy7z1w/action-required?token=" + validation_key)
    };

   generateAccessToken(b64_creds, is_production, (access_token) => {          
        var url =registration_url(is_production);
        const options = {
            url: url,
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-Charset": "utf-8",
                Authorization: "Bearer " + access_token,
            },
            json: post_data,
        };    
        request(options, function (err, res, body) {
            if (err) {
               console.log("error occurred: ", err);
            } else {               
               console.log("success", body);
            }
        });
    });
} 

module.exports.processPayment = processPayment;