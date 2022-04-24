
const bills = require("../../models/tenants").Bills;
const Bill = require("../../models/tenants").Bill;
const Tenant = require("../../models/tenants").Tenant;
const Unit = require("../../models/units").Unit;
const notifications = require("../../models/users").Notifications;
const Units = require("../../models/units").Units;
const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");
const globals = require("../../helpers/global.params");
const AccountsList = require("../../models/properties").AccountsList;
const ph = require("../../helpers/payments");  

const sms = require("../../libs/sms.sender");
const uuid = require("uuid");
const moment = require("moment");

const express = require("express");
const router = express.Router();

router.get('/', async function (req, res) {  
    res.renderEjs(req, "accounting/tenant-invoices", {
        page_title: "Tenant Invoices",
        sub_header: req.user_property.property_name,        
        property: req.user_property       
    });
});

router.get('/new', function (req, res){
    res.renderEjs(req, "accounting/new-tenant-invoice", {
        page_title: "New Invoice",
        sub_header: req.user_property.property_name,        
        property: req.user_property,
    });
});

router.get('/download-invoice/:id', async function (req, res, next){
    if (req.params.id) {
        let invoice_data = await bills.billInfo(req.user_property.property_code, req.params.id, req.query.code);        
        if (invoice_data) {        
            invoice_data.payment_methods = await AccountsList.list(req.session.user_code);
            const fs = require("fs");
            const path = require("path");
            var temp_path = path.join(globals.views_dir, "templates", "tenant_invoice.html");
            fs.readFile(temp_path, "utf8", function(err, fd) {
                if (err) {
                    //logger.error(err);
                } else {
                    var invoice_template = fd.toString();
                    var search = "<%bill_code%>";
                    var replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.bill_code);

                    search = "<%full_name%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.tenant_name);

                    search = "<%bill_month_year%>";
                    replacer = new RegExp(search, "g");                   
                    invoice_template = invoice_template.replace(replacer, helpers.monthNames()[invoice_data.bill_month - 1] + ", " + invoice_data.bill_year);

                    search = "<%unit_name%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.unit_name);

                    search = "<%bill_code%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.bill_code);

                    search = "<%bill_date%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.bill_date);

                    search = "<%phone_number%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.phone_number || "");

                    search = "<%email_address%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.email_address || "");

                    search = "<%property_name%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.property_name);

                    search = "<%property_address%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, invoice_data.property_address || "");

                    var bills = JSON.parse(invoice_data.bills_breakdown);
                    var bill_details = "";
                    for (var i = 0; i < bills.length; i++) {
                        var row = "<tr><td>" + bills[i].bill_name + '</td><td class="text-right">' + helpers.formatDecimal(bills[i].bill_amount) + "</td> </tr>";
                        bill_details += row;
                    }

                    search = "<%bill_details%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, bill_details);

                    var payments = JSON.parse(invoice_data.payments_breakdown);
                    var payment_details = "";
                    for (var i = 0; i < payments.length; i++) {
                        var row = '<tr class="font-weight-boldest"><td>' + payments[i].payment_date + "</td><td>" + payments[i].payment_method + '</td><td class="pr-0 pt-7 text-right">' + helpers.formatDecimal(payments[i].payment_amount) + '</td><td class="text-right">' + payments[i].payment_ref + "</td></tr>";
                        payment_details += row;
                    }

                    search = "<%payment_details%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, payment_details);

                    search = "<%total_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatMoney(invoice_data.total_amount));

                    search = "<%paid_amount%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatMoney(invoice_data.paid_amount));

                    var balance = invoice_data.total_amount - invoice_data.paid_amount;
                    search = "<%balance%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, helpers.formatMoney(balance));

                    var watermark = "<div style=\"border: 4px solid #008000;border-radius: 6px; color: #008000; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 24pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 18px;\"> CLEARED </div>";
                    if (balance > 0) {
                        watermark = "<div style=\"border: 4px solid #F53333;border-radius: 6px; color: #F53333; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 24pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 18px;\"> UNCLEARED </div>";
                    }

                    var methods = [];
                    if (invoice_data.payment_methods !== null) {
                        methods = invoice_data.payment_methods;
                    }
                    

                    var part1 ='<ol>';
                    for(var i = 0; i < methods.length; i++) {
                        var ind = parseInt(i + 1);
                        part1 += '<li> <strong>' + methods[i].account_name + "(" + methods[i].account_no  + ")</strong> - " + methods[i].payment_instructions +"</li>";
                    }
                    part1 +='</ol>';

                    search = "<%payment_instructions%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, part1);

                    search = "<%watermark%>";
                    replacer = new RegExp(search, "g");
                    invoice_template = invoice_template.replace(replacer, watermark);

                    res.downloadPDF(invoice_template, invoice_data.bill_code);
                }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

router.get('/bill-available', async function (req, res, next){
    if (req.query.bill_id) {
        var bill_id = decodeURIComponent(req.query.bill_id);
        let result = await bills.billRegistered(bill_id);                     
        res.json(result);
    } else {
        next();
    }
});

router.post('/', async function (req, res){
    let bs = await new bills();
    bs.where_data = 'property_code = "' + req.user_property.property_code + '"';
    let data = await bs.all(req.body);
    res.json(data);
});

router.post('/invoice-info', async function (req, res){
    if (req.body.bill_id) {
        let invoice_info = await bills.billInfo(req.user_property.property_code, req.body.bill_id);
        if (invoice_info) {         
            let acs = await AccountsList.list(req.session.user_code);
            invoice_info.payment_methods = acs;
            res.successEndData(invoice_info);
        } else {
            res.errorEnd("Invoice could not be found");
        }
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/cancel', async function(req, res){
    if (req.body.invoice_id) {
        let invoice_info = await new Bill(req.user_property.property_code, req.body.invoice_id);
        if (invoice_info) {
            let cancelled = await invoice_info.cancel();
            if (cancelled) {
                res.successEnd("Invoice has been cancelled");
            } else {
                res.errorEnd("Unable to cancel the invoice. Please try again later");
            }
        }else{
            res.errorEnd("The invocie cannot be located!");
        }                    
       
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/delete', async function(req, res){
    if (req.body.invoice_id) {
        let invoice_info = await new Bill(req.user_property.property_code, req.body.invoice_id);
        if(invoice_info.bill_id){
            let deleted = await invoice_info.delete_entry();

            if (deleted) {
                res.successEnd("Invoice has been deleted");
            } else {
                res.errorEnd("The selected invoice cannot be deleted!");
            }
        }else{
            res.errorEnd("The selected invoice cannot be located!");
        }
        
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/new', async function (req, res){
    var validate = validator.Validate(req.body, validation_helper.newTenantInvoice());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var bill_code = helpers.generate_random_upper(10);
        var bill_id = uuid.v4();
        var pats = helpers.string_to_object(req.body.bill_particulars.toString());
        var bill_entries = [];
        var invoice_total = 0;
        for (var i = 0; i < pats.length; i++) {
            var t = parseFloat(pats[i].Amount) || 0;
            if (pats[i].Particular) {
                var bill_entry = {
                    bill_name: pats[i].Particular,
                    bill_id: bill_id,
                    bill_amount: t,
                };
                invoice_total += t;
                bill_entries.push(bill_entry);
            }
        }

        let active_lease = await Units.activeLease(req.body.unit_code);
        var bill_obj = {
            bill_id: bill_id,
            bill_code: bill_code,
            unit_code: req.body.unit_code,
            bill_date: moment().format(),
            due_date: req.body.due_date,
            tenant_id: req.body.tenant_id,
            lease_id: active_lease.lease_id
        };

        let bill = await new Bill();
        Object.assign(bill, bill_obj);

        if(bill_entries.length ===0) {
            return res.errorEnd("The invoice has no defined particulars!");
        }

        let bill_added = await bill.save(bill_entries);
        if (bill_added) {
            res.successEnd("An invoice has been created");
            setTimeout(
                async function() {
                    await ph.autoPay(bill_obj.tenant_id);
                }, 10000);           
        
            
            let tenant_info = await new Tenant(req.session.property_code, req.body.tenant_id);
            let unit_info = await new Unit(req.session.property_code, req.body.unit_code);
            var unit_name = unit_info.unit_name;
            if (req.user_property.floors > 1) {
                unit_name += " - " + helpers.floorToLabel(unit_info.floor);
            }
            var sms_message = "Dear " + tenant_info.first_name + ", a new invoice has been created for " + req.user_property.property_name + ", RM " + unit_name + ". The invoice amount " + helpers.formatMoney(invoice_total);
            //send mail
            sms.sendSms(req.user_property.property_code, tenant_info.phone_number, sms_message, [], (sms_sent) => {});
        } else {
            res.errorEnd("Unable to create a new invoice");
        }
    }   
});

router.post('/update-invoice', async function (req, res) {
    if (req.body.bill_id) {
        var pats = req.body.bill_particulars;
        if (pats.length === 0) {
            res.errorEnd("Invoice do not have defined particulars");
        } else {
            var bill_entries = [];
            for (var i = 0; i < pats.length; i++) {
                if (pats[i].Particular && parseFloat(pats[i].Amount)) {
                    var bill_entry = {
                        bill_name: pats[i].Particular,
                        bill_id: req.body.bill_id,
                        bill_amount: pats[i].Amount,
                    };
                    bill_entries.push(bill_entry);
                }
            }

            let b = await new Bill(req.user_property.property_code, req.body.bill_id);
            let updated = await b.update(bill_entries);
            if (updated) {
                res.successEnd("Invoice details have been updated");
                setTimeout(
                    async function() {
                        await ph.autoPay(bill_obj.tenant_id);
                    }, 10000);
            } else {
                res.errorEnd("Unable to update the invoice currently");
            }
        }
    } else {
        res.errorEnd("Invalid parameters");
    }
});

router.post('/send-reminders', async (req, res) => {
    var validate = validator.Validate(req.body, validation_helper.tenantsIncoiceReminders());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var days = 0 || parseInt(req.body.defaulted_days);
        var bal = 0 || parseInt(req.body.balance_above);
        let all_invoices = await  bills.unpaidInvoices(req.params.id, days, bal)
        res.successEnd("Received. Messages will be processed");
        for (var i = 0; i < all_invoices.length; i++) {
            var sms_message = req.body.sms_template;

            var replacer = new RegExp("{first_name}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].first_name);

            replacer = new RegExp("{last_name}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].last_name);

            replacer = new RegExp("{balance}", "g");
            sms_message = sms_message.replace(replacer, helpers.formatMoney(all_invoices[i].balance));

            replacer = new RegExp("{paid_amount}", "g");
            sms_message = sms_message.replace(replacer, helpers.formatMoney(all_invoices[i].paid_amount));

            replacer = new RegExp("{bill_amount}", "g");
            sms_message = sms_message.replace(replacer, helpers.formatMoney(all_invoices[i].total_amount));

            replacer = new RegExp("{property_name}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].property_name);

            replacer = new RegExp("{unit_name}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].unit_name);

            replacer = new RegExp("{bill_date}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].bill_date);

            replacer = new RegExp("{due_date}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].due_date);

            replacer = new RegExp("{bill_code}", "g");
            sms_message = sms_message.replace(replacer, all_invoices[i].bill_code);

            var other_info = {
                first_name: all_invoices[i].first_name,
                phone_number: all_invoices[i].phone_number,
                unit_name: all_invoices[i].unit_name,
                property_name: req.user_property.property_name,
                user_code: req.session.user_code,
            };
            sms.sendSms(req.user_property.property_code, all_invoices[i].phone_number, sms_message, other_info, (sms_sent, back_info) => {
                if (!sms_sent) {
                    var obj = {
                        note_head: "SMS Failed",
                        note_message: "SMS to " + back_info.first_name + " - " + back_info.phone_number + " of " + back_info.unit_name + ", " + back_info.property_name + " could not be sent!",
                        user_code: back_info.user_code,
                        note_class: "danger",
                        note_icon: "bx bxs-message-rounded",
                    };
                    notifications.Add(obj);
                }
            });
        }
    }
});

router.post('/add-payment', function(req, res) {
    ph.preparePayment(req.body, req.user_property, req, res);
});

router.post('/list', async function(req, res) {
    let list = await bills.list(req.body.tenant_id);
    res.successEnd(list);
});

module.exports = router;