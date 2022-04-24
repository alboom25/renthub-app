const express = require("express");
const router = express.Router();

const helpers = require("../helpers/assorted.helpers");
const users = require("../models/users").Users;
const user_payments = require("../models/users").Payments;
const moment = require("moment");
const bill_generators = require("../helpers/bill.generators");
var uuid = require("uuid");
const sms = require("../libs/sms.sender");
const mpesa = require("../libs/mpesa.payments");


const validation_key = "71a66279848887bbedebbb2626f85ebf07fc4104";

router.all("/*", function (req, res, next){   
    if (req.query.token) {       
        if (req.query.token == validation_key){
            next();  
        } else{            
            res.end(JSON.stringify({"ResultCode":1,"ResultDesc":"Failed. Invalid auth token","ThirdPartyTransID":0}));
        }         
    } else {       
        res.end(JSON.stringify({"ResultCode":1,"ResultDesc":"Failed. Missing auth token","ThirdPartyTransID":0}));
    }
});

router.all("/action-required", function (req, res) {    
    res.end(JSON.stringify({"ResultCode":0,"ResultDesc":"Success. Request accepted for processing","ThirdPartyTransID":0}));
});

router.all("/payment-received", function (req, res) {       
    res.end(JSON.stringify({"ResultCode":0,"ResultDesc":"Confirmation received successfully"}));
    if(req.query.push=="true"){
        if(req.body.Body){
            var body = req.body.Body;
            if(body.stkCallback){
                var callback = body.stkCallback;
                var id = callback.CheckoutRequestID;
                if(callback.ResultCode==0){
                    //completed
                    var data = callback.CallbackMetadata.Item;
                    var pdata = {};
                    for(var i = 0; i < data.length; i++){
                        pdata[data[i].Name]=data[i].Value;                                    
                    }
                    pdata.TransactionDate= moment(pdata.TransactionDate, "YYYYMMDDHHmmss").toDate();; 
                    console.log(pdata)
    
                }else{
                    //failed
                    console.log(callback.ResultDesc)
                }           
            }else{
                 //not completed
                 console.log(body)
            }
        }else{
            console.log("fake request")
        }
       
    }else{       
        var payment_object ={
            TransactionType: req.body.TransactionType,
            TransID:req.body.TransID,
            TransTime:req.body.TransTime,
            TransAmount:req.body.TransAmount,
            BusinessShortCode:req.body.BusinessShortCode,
            BillRefNumber:req.body.BillRefNumber,
            InvoiceNumber:req.body.InvoiceNumber,
            ThirdPartyTransID:req.body.ThirdPartyTransID,
            MSISDN:req.body.MSISDN,
            FirstName:req.body.FirstName,
            MiddleName:req.body.MiddleName,
            LastName:req.body.LastName,
            OrgAccountBalance:req.body.OrgAccountBalance
        };
        user_payments.getInvoiceByCode(req.body.InvoiceNumber, (invoice_info)=>{
            if(invoice_info){
                user_payments.registerMpesaPayment(payment_object);
                var invoice_payment = {
                    payment_id:uuid.v4(),
                    paid_amount:payment_object.TransAmount,
                    payment_method:"M-PESA",
                    payment_date: new Date(payment_object.TransTime),
                    paid_by: payment_object.FirstName +' '+ payment_object.MiddleName + ' '+ payment_object.LastName,
                    payment_ref: payment_object.TransID,
                    invoice_id : invoice_info.invoice_id
                };
                user_payments.registerInvoicePayment(invoice_payment, (added)=>{
                    if(added){
                        var balance = invoice_info.invoice_amount - payment_object.TransAmount;
                        var message ="Your payment to Rent Hub for invoice "+ invoice_info.invoice_id + " has been received. "
                        if(balance>0){
                            message +="A balance of "+ helpers.formatMoney(balance) +" is still remaining";
                        }else{
                            message +=" Your balance has been cleared.";
                        }
                        users.GET(invoice_info.user_code, (profile_info)=>{
                            if(profile_info){
                                if(profile_info.phone_number && profile_info.phone_verified){
                                    sms.sendSms(null, profile_info.phone_number, message, [], (sms_sent, back_info) => {                                   
                                    });
                            }
                            }
                        });
                    }else{
                        //notify admins
                    }
                });

            }else{
                user_payments.registerFailedMpesaPayment(payment_object);  
            }
        });
    
    }
   
   
});

router.all("/register-callbacks", (req, res)=> {
    mpesa.registerLinks((registered)=>{
        res.end("ok")
    })
});

router.get("/generate-tenant-bills", (req, res)=> {
    res.successEnd("The request has been sent");   
    new bill_generators().serverAutoGenerate(false);
});


module.exports = router;
