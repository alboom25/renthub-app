const validator = require("../libs/validator");
const validation_helper = require("../helpers/validation.helper");
const bill = require("../models/tenants").Bill;
const Bills = require("../models/tenants").Bills;
const Payment = require("../models/tenants").Payment;
const Payments = require("../models/tenants").Payments;
const helpers = require("../helpers/assorted.helpers");
const file_helpers = require("../helpers/file.helpers");

const globals = require("../helpers/global.params");
const sms = require("../libs/sms.sender");
const moment = require("moment");
const uuid = require("uuid");
const path = require("path");

module.exports.preparePayment = async function (body, user_property, req, res) {   
    var validate = validator.Validate(body, validation_helper.newTenantPayment());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        if(body.bill_id){
            let invoice_info = await new bill(user_property.property_code, body.bill_id);
      
            if (invoice_info) {
                var balance = invoice_info.total_amount - invoice_info.paid_amount;
                var excess = 0;
                var paid_amount = parseFloat(body.payment_amount);
                if (paid_amount > balance) {
                    excess = paid_amount - balance;
                }
    
                var obj = {                 
                    payment_date: req.body.payment_date,
                    target_account: req.body.target_account,
                    payment_method: req.body.payment_method,
                    payment_amount: req.body.payment_amount,
                    payment_ref: req.body.payment_ref || 'N/A',
                    payment_by: req.body.payment_by,
                    recorded_by: req.session.user_code,
                    bill_id: req.body.bill_id
                };
    
                let p = await new Payment();
                Object.assign(p, obj);               
                let payment_added = await p.save(excess, invoice_info.tenant_id);           
                if (payment_added) {
                    res.successEnd("Payment has been added successfully");
                    if (req.files) {
                        if (Object.keys(req.files).length === 1) {
                            var f = req.files.payment_receipt.name.split(".");
                            var ext = f[f.length - 1];
                            var file_name = req.user_property.property_code + p.payment_id + "." + ext;
    
                            let receipt_file = req.files.payment_receipt;
                            var fl = path.join(globals.private_dir, "receipts", file_name);
                            let file_saved = await file_helpers.upload_file(receipt_file, fl);
                            if (file_saved) {
                                p.add_file(file_name,ext);
                            }
                        }
                    }
                    

                    setTimeout(
                        async function() {
                            await autoPay(invoice_info.tenant_id);
                        }, 10000); 
    
                    
    
                    var balance_text = "Your outstanding balance is " + helpers.formatMoney(balance) + ".";
                    if (balance === 0) {
                        balance_text = "Your balance has been cleared.";
                    } else if (balance < 0) {                    
                        balance_text = "An excess of " + helpers.formatMoney(-balance) + " has been carried forward.";
                    }
                    var sms_message = "Dear " + invoice_info.first_name + ", Your payment of " + helpers.formatMoney(body.payment_amount) + " for invoice " + invoice_info.bill_code + ", " + user_property.property_name + ", RM-" + invoice_info.unit_name + " " + helpers.monthNames[invoice_info.bill_month - 1] + ", " + invoice_info.bill_year + " has been received. " + balance_text;
                    var other_info = {
                        first_name: invoice_info.first_name,
                        phone_number: invoice_info.phone_number,
                        unit_name: invoice_info.unit_name,
                        property_name: user_property.property_name,
                        user_code: req.body.recorded_by,
                    };                 
    
                    sms.sendSms(req.user_property.property_code, invoice_info.phone_number, sms_message, other_info);
                } else {
                    return res.errorEnd("Unable to add payment. Please check your data and try again!");
                }
            } else {
                //deposit excess
                return res.errorEnd("Invoice could not be found");
            }
        }else{
            let obj = {
                payment_id:uuid.v4(),
                payment_date: moment().format(),
                excess_amount: parseFloat(req.body.payment_amount),
                original_bill_id:'',
                tenant_id: req.body.tenant_id,
                target_account: req.body.target_account,
                payment_method: req.body.payment_method,
                added_by: req.session.user_code,
                payment_ref: req.body.payment_ref || 'N/A',
            };
           
            let saved = await Payments.addExcess(obj);
            if(saved){
                res.successEnd("Payment has been added successfully");
            }else{
                res.errorEnd("Unable to add payment. Please check your data and try again!");
            }
           
        }       
    }
}

async function autoPay(tenant_id){
    let excess_obj = await Payments.excess(tenant_id);   

    if(excess_obj){        
        let unpaid_bill = await Bills.unpaidSingle(tenant_id);   
      
        if(unpaid_bill){
            var balance = unpaid_bill.total_amount - unpaid_bill.paid_amount;
            var excess = 0;
            var paid_amount = excess_obj.excess_amount;
            if (paid_amount > balance) {
                excess = paid_amount - balance;
            }
    
            var obj = {                 
                payment_date: moment().format(),
                target_account: excess_obj.target_account,
                payment_method: excess_obj.payment_method,
                payment_amount: paid_amount,
                payment_ref: excess_obj.payment_ref || 'N/A',
                payment_by: "Carried forward",
                recorded_by: excess_obj.added_by,
                bill_id: unpaid_bill.bill_id
            };
    
            let p = await new Payment();
            Object.assign(p, obj);               
            let payment_added = await p.save(excess, tenant_id, excess_obj.payment_id, excess_obj.original_bill_id, 1);           
            if (payment_added && paid_amount < balance) {                    
                setTimeout(
                    async function() {
                        await autoPay(tenant_id);
                    }, 10000);               
            }     
        }        
    } 
}

module.exports.autoPay = autoPay;