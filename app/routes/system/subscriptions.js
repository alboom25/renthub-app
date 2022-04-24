const uuid = require("uuid");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const Users = require("../../models/users").Users;
const Properties = require("../../models/properties").Properties;
const Packages = require("../../models/packages").Packages;
const Package = require("../../models/packages").Package;
const Subscriptions = require("../../models/users").Subscriptions;
const Subscription = require("../../models/users").Subscription;
const Payment = require("../../models/payments").Payment;

const Invoice = require("../../models/users").Invoice;

router.get("/", function (req, res) {
    res.renderEjs(req, "subs/all", {
        page_title: "My Subscription History",
        sub_header: "",        
    });
});

router.post("/", async function (req, res) {
    if (req.query.action) {
        if ((req.query.action = "get-all")) {          
            let s = await new Subscriptions();
            s.where_data = 'user_code = "'+ req.session.user_code+'"';
            let data  = await s.all(req.body) || []; 
            res.json(data);           
        } else {
            res.errorEnd("Failed! Invalid request");
        }
    } else {
        res.errorEnd("Failed! Invalid request");
    }
});

router.get("/new", async function (req, res) {
    let demo_available = await Users.demoSubscriptionAvailable(req.session.user_code);
    if (demo_available) {
        let s = await new Packages();
        let data = await s.all();
        res.renderEjs(req, "subs/new-demo", {
            page_title: "New Subscription", 
            sub_header: "Package",                
            subs: data,
        });
    } else {           
        let available_Properties = await Properties.getBriefAll(req.session.user_code);
        let data = await Packages.getPremium(available_Properties.length);
        res.renderEjs(req, "subs/new-demo", {
            page_title: "Renew/Upgrade Subscription",                   
            sub_header: "Package",                
            subs: data,
        });
    }
});

router.get("/subscribe/:id?", async function (req, res, next) {   
    if (req.params.id) {
        let demo_available = await Users.demoSubscriptionAvailable(req.session.user_code);
        if(!demo_available && req.params.id==='vy0is4ez65sq'){
            return next();
        }
        let pack =  await new Package(req.params.id);        
        if(pack.package_id){
            var final_rate=pack.package_rate;
            switch(req.query.plan){
                case 'quarterly':
                    var init_rates =  pack.package_rate * 3;
                    final_rate = init_rates - (0.12 * init_rates);
                    break;
                case 'semi_annually':
                    var init_rates =  pack.package_rate * 6;
                    final_rate = init_rates - (0.14 * init_rates);
                    break;
                case 'annually':
                    var init_rates =  pack.package_rate * 12;
                    final_rate = init_rates - (0.18 * init_rates);
                    break;
            }
            pack.offer_price = final_rate;
            pack.payment_plan=req.query.plan;

            let available_Properties = await Properties.getBriefAll(req.session.user_code);
            if (available_Properties.length <= pack.maximum_properties) {                       
                res.renderEjs(req, "subs/confirm", {
                    page_title: "Confirm Subscription",                 
                    sub_header: "Confirm",                
                    subs: pack,
                });
            } else {
                res.renderEjs(req, "subs/not-available", {
                    page_title: "Confirm Subscription",                 
                    sub_header: "Confirm",                
                    subs: pack,
                });               
            }             
        }else{ 
            res.redirect("/system/subscriptions");
        }       
    } else {       
        res.redirect("/system/subscriptions");
    }
});

router.post("/subscribe/:id", async function (req, res) {
    if (req.params.id) {
        let package_data =  await new Package(req.params.id);
        if(package_data.package_id){
            let demo_available = await Users.demoSubscriptionAvailable(req.session.user_code);
            if(!demo_available && req.params.id==='vy0is4ez65sq'){
                return  res.errorEnd("Unable to proceed. You cannot use demo package at the moment!");
            }
            let available_Properties = await Properties.getBriefAll(req.session.user_code);
            if (available_Properties.length <= package_data.maximum_properties) {         
                var due_date = new Date();              
                due_date.setDate(due_date.getDate()+ 30);
                switch(req.body.plan){
                    case 'quarterly':
                        var init_rates =  package_data.package_rate * 3;
                        package_data.package_rate = init_rates - (0.12 * init_rates);
                        due_date.setDate(due_date.getDate()+ 30 * 3);
                        break;
                    case 'semi_annually':
                        var init_rates =  package_data.package_rate * 6;
                        package_data.package_rate = init_rates - (0.14 * init_rates);
                        due_date.setDate(due_date.getDate()+ 30 * 6);
                        break;
                    case 'annually':
                        var init_rates =  package_data.package_rate * 12;
                        package_data.package_rate = init_rates - (0.18 * init_rates);
                        due_date.setDate(due_date.getDate()+ 30 * 12);
                        break;
                }                

                var obj = {                       
                    invoice_due_date: due_date,
                    invoice_amount: package_data.package_rate,
                    package_id: package_data.package_id, 
                    payment_plan: req.body.plan||'monthly'                                    
                };

                let inv =  await new Invoice(req.session.user_code);
                Object.assign(inv, obj);

                let saved = await inv.save();
                if (saved) {
                    res.successEnd(req.__base_url + "/system/invoices/" + inv.invoice_id);
                    if (package_data.package_rate == 0) {                                       
                        var sub_data = {                               
                            user_code: req.session.user_code,
                            package_id: package_data.package_id,
                            payment_plan: req.body.plan||'monthly',
                            subscription_date: moment().format(),
                            expiry_date: due_date,
                        };

                        let sub = await new Subscription();
                        Object.assign(sub, sub_data);
                        saved = await sub.save(package_data.free_sms_units);
                        if(saved){
                            //add notification , send sms
                        }else{
                            //add failure notification
                        }
                    } else {
                        let current_sub = await Users.userSubscription(req.session.user_code);

                        if (current_sub) {
                            if (current_sub.package_id != "vy0is4ez65sq") {                                   
                                var a = moment(current_sub.expiry_date);
                                var b = moment(moment().format());
                                var diff_days = b.diff(a, "days");
                                if (diff_days<0) {
                                   
                                  
                                    var a = moment(current_sub.subscription_date);
                                    var b = moment(moment().format());                                  
                                    var remaining_days = b.diff(a, "days");
                                  
                                   
                                    var plan_days = 30;
                                    switch(current_sub.payment_plan){
                                        case 'quarterly':
                                            plan_days = 30 * 3;
                                            break;
                                        case 'semi_annually':
                                            plan_days = 30 * 6;
                                            break;
                                        case 'annually':
                                            plan_days = 30 * 12;
                                            break;
                                    }

                                    var remaining_amount = (current_sub.package_rate / plan_days) * remaining_days;
                                    var obj = {
                                        payment_id: uuid.v4(),
                                        paid_amount: remaining_amount,
                                        payment_method: "CARRIED FORWARD",
                                        payment_date: moment().format(),
                                        paid_by: req.user_profile.first_name,
                                        payment_ref: "",
                                        invoice_id: inv.invoice_id,
                                    };

                                    let pmt =  await new Payment();
                                    Object.assign(pmt, obj);
                                    let payment_result = await pmt.save();

                                    if (payment_result) {
                                        let csub = await new Subscription(current_sub.subscription_id);
                                        csub.expiry_date = moment().format();
                                        await csub.update();                                       
                                    } 
                                }
                            }                         
                        }
                    }
                   
                } else {
                    res.errorEnd("Unable to proceed. Please try again later");
                }
               
            } else {
                res.errorEnd("Failed! You already have existing properties. You are not egligible for this Package");
            }
        }else{
            res.errorEnd("Unable to confirm subscription");
        }            
    } else {
        res.errorEnd("Unable to confirm subscription");
    }
});

module.exports = router;