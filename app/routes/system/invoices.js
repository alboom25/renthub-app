const uuid = require("uuid");
const moment = require("moment");
const express = require("express");
const router = express.Router();

const globals = require("../../helpers/global.params");

const payments = require("../../models/payments").Payments;
const MpesaPayments = require("../../models/payments").MpesaPayments;
const subs = require("../../models/users").Subscriptions;
const Package = require("../../models/packages").Package;
const Subscription = require("../../models/users").Subscription;
const invoice = require("../../models/users").Invoice;
const invoices = require("../../models/users").Invoices;
const mpesa = require("../../libs/mpesa");


const helpers = require("../../helpers/assorted.helpers");

router.get("/", function (req, res) {
    res.renderEjs(req, "invoices/all", {
        page_title: "My Invoices",
        sub_header: "My Invoices",        
    });
});

router.post("/", async function (req, res) {
    if (req.query.action) {
        if (req.query.action == "get-all") {
            let invs = await new invoices();
            invs.where_data = 'user_code = "'+ req.session.user_code +'"';
            let data = await invs.all(req.body);
            res.json(data);

        } else if ((req.query.action = "delete-invoice")) {
            if (req.body.invoice_id) {
                let invoice_data = await new invoice(req.session.user_code,req.body.invoice_id);
                if(invoice_data.invoice_id){
                    var bal = invoice_data.invoice_amount - invoice_data.paid_amount;
                    if (invoice_data.paid_amount == 0 && bal > 0) {
                        let invoice_deleted = await invoices.delete(invoice_data.invoice_id);
                        if (invoice_deleted) {
                            res.successEnd("The invoice has been deleted");
                        } else {
                            res.errorEnd("Failed! Unable to delete the invoice. Please try again later.");
                        }
                    } else {
                        res.errorEnd("Failed! Cannot delete invoice which has been paid for");
                    }
                }else{
                    res.errorEnd("Failed! Invalid parameters");
                }                
            } else {
                res.errorEnd("Failed! Missing parameters");
            }
        } else {
            res.errorEnd("Failed!. Invalid request");
        }
    } else {
        res.errorEnd("Failed!. Invalid request");
    }
});

router.get("/:id", async function (req, res, next) {
    if (req.params.id) {
        let invoice_data = await new invoice(req.session.user_code,req.params.id);      

        if(invoice_data.invoice_id){          
            let package_data =  await new Package(invoice_data.package_id);
            if(package_data.package_id){
                let payment_data = await invoice_data.payments();
               
                res.renderEjs(req, "invoices/preview", {
                    page_title: "Invoice",   
                    sub_header: invoice_data.invoice_id,                    
                    package_data: package_data,
                    payment_data: payment_data,
                    invoice_data: invoice_data,
                    auto_pay:false,
                });
            }else{
                next();
            }           
        }else{
            next();
        }        
    } else {
        next();
    }
});

router.post("/:id", async function (req, res) {
    if (req.params.id) {
        let invoice_data = await new invoice(req.session.user_code,req.params.id); 
        let balance = invoice_data.invoice_amount - invoice_data.paid_amount;

        if(invoice_data.invoice_id){
            if (req.query.action == "request-payment") {               
                if (req.body.mpesa_payment_no) {
                   
                    if (balance > 0) {                            
                        var pdata={
                            PhoneNumber:req.body.mpesa_payment_no, 
                            Description:"Package subscription payment online",
                            Reference:invoice_data.invoice_id,
                            Amount:balance
                        };
                        
                       let result = await mpesa.processPayment(pdata);
                       if(result.passed){
                            res.successEnd(result.message);
                        }else{
                            res.errorEnd(result.message);
                        }

                    } else {
                        res.errorEnd("Unable to proceed. Invoice already paid up!");
                    }
                } else {
                    res.errorEnd("Unable to proceed. Phone number missing!");
                }
            } else if (req.query.action == "confirm-payment") {
                if (balance > 0) {
                    res.errorEnd("Payment not found. Please try again after few seconds!");
                } else {
                    res.successEnd("Payment has been received!");
                }
            } else if (req.query.action == "confirmation-code") {
                let trx = await MpesaPayments.get(req.body.mpesa_confirmation);
                if(trx){
                    if(trx.UtilizerInvoice){
                        res.errorEnd("This payment has already been utilized!");
                    }else{
                        let utilized = await MpesaPayments.utilize(req.body.mpesa_confirmation, req.params.id, req.session.user_code);
                        if(utilized){
                            res.errorEnd("Your payment has been successfully confirmed!");
                        }else{
                            res.errorEnd("Unable to confirm the transaction. Please try again after few minutes!");
                        }
                    }
                }else{
                    res.errorEnd("Payment not found. Please try again after few seconds!");
                }                
            } else {
                res.errorEnd("Unable to proceed. Invalid request!");
            }
        }else{
            res.errorEnd("Unable to proceed. Invalid parameters!");
        }
    } else {
        res.errorEnd("Unable to proceed. Missing parameters!");
    }
});

router.get("/generate-pdf/:id", async function (req, res, next) {
    if (req.params.id) {
        let invoice_data = await new invoice(req.session.user_code,req.params.id);       
        if(invoice_data.invoice_id){
            let package_data =  await new Package(invoice_data.package_id);
            let payment_data = await invoice_data.payments();

            const fs = require("fs");
            const path = require("path");
            var temp_path = path.join(globals.views_dir, "templates", "invoice_template.html");
            fs.readFile(temp_path, "utf8", function (err, fd) {
                if (err) {
                    //logger.log(err);
                } else {
                    var invoice_template = fd.toString();
                    var search = "<%invoice_id%>";
                    var replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.invoice_id);

                    search = "<%invoice_date%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.invoice_date);

                    search = "<%invoice_due_date%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.invoice_due_date);

                    var status = '<h4 class="text-success">Paid</h4>';
                    if (invoice_data.invoice_amount - invoice_data.discount_amount + invoice_data.paid_amount > 0) {
                        status = '<h4 class="text-danger">Unpaid</h4>';
                    }
                    search = "<%status%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, status);

                    var user_profile = req.user_profile;
                    var recepient = user_profile.first_name + " " + user_profile.last_name;
                    if (user_profile.company_name !== null) {
                        if (user_profile.company_name.length > 3) {
                            recepient = user_profile.company_name.toUpperCase();
                        }
                    }

                    search = "<%recepient%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, recepient);

                    search = "<%address%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, user_profile.address || '');

                    search = "<%email_address%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, user_profile.email_address);

                    search = "<%phone_number%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, user_profile.phone_number || '');

                    search = "<%package_name%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, package_data.package_name);

                    search = "<%package_rate%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatDecimal(package_data.package_rate));

                    search = "<%invoice_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatDecimal(invoice_data.invoice_amount));

                    search = "<%invoice_total%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatDecimal(invoice_data.invoice_amount - invoice_data.discount_amount));

                    search = "<%discount_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatDecimal(invoice_data.discount_amount));

                    search = "<%paid_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatMoney(invoice_data.paid_amount));

                    var balance = invoice_data.invoice_amount - (invoice_data.discount_amount + invoice_data.paid_amount);
                    search = "<%balance_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatMoney(balance));

                    var p_data = "<div class='alert alert-custom alert-light-danger fade show mb-5 '><p><strong>No payment(s) found.</strong></div>";

                    if (payment_data.length > 0) {
                        var tbl = '<div class="mx-10" ><table class="table table-borderless"><thead><tr class="border-0"><th scope="col">Pay Date</th><th scope="col">Mode</th><th scope="col">Ref</th><th scope="col" class="text-right">Amount</th></tr></thead><tbody>';
                        for (var i = 0; i < payment_data.length; i++) {
                            var entry = "<tr><td>" + payment_data[i].payment_date + "</td><td>" + payment_data[i].payment_method + "</td><td>" + payment_data[i].payment_ref + '</td><td class="text-primary text-right font-weight-bold">' + payment_data[i].paid_amount + "</td></tr>";
                            tbl += entry;
                        }
                        tbl += "</tbody></table></div>";
                        p_data = tbl;
                    }

                    var watermark = "<div style=\"border: 6px solid #008000;border-radius: 8px; color: #008000; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 28pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 24px;\"> CLEARED </div>";
                    if (balance > 0) {
                        watermark = "<div style=\"border: 6px solid #F53333;border-radius: 8px; color: #F53333; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 28pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 24px;\"> UNCLEARED </div>";
                    }
                    search = "<%watermark%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, watermark);

                    search = "<%payment_data%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, p_data);
                    invoice_template = invoice_template.replace(replacer, p_data);
                    
                    res.downloadPDF(invoice_template, invoice_data.invoice_id);
                }
            });

        }else{
            next();
        }       
    } else {
        next();
    }
});

module.exports = router;