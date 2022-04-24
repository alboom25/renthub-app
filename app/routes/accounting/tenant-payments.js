
const express = require("express");
const router = express.Router();

const payments = require("../../models/tenants").Payments;
const payment = require("../../models/tenants").Payment;
const billing = require("../../models/tenants").Bills;
const bill = require("../../models/tenants").Bill;
const notifications = require("../../models/users").Notifications;
const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");
const globals = require("../../helpers/global.params");
const sms = require("../../libs/sms.sender");
const uuid = require("uuid");

const moment = require("moment");

router.get('/', function (req, res) {   
    res.renderEjs(req, "property-payments/all", {
        page_title: "Tenant Payments",
        sub_header: req.user_property.property_name,        
        property: req.user_property,
    });
});

router.post('/', async function (req, res) {
    let bs = await new payments();
    bs.where_data = 'property_code = "' + req.user_property.property_code + '"';
    let data = await bs.all(req.body);
    res.json(data);
});

router.post('/cancel', async function (req, res){
    if (req.body.id && req.body.reasons.length > 3) {
        var obj = {
            is_cancelled: true,
            cancel_reasons: req.body.reasons,
            cancelled_by: req.session.user_code,
            cancel_date: moment().format()
        };

        let pc = await new payment(req.user_property.property_code, req.body.id);                   
        if(pc.payment_id){
            let cancelled = await pc.cancel(obj);
            if (cancelled) {
                res.successEnd("The transaction has been cancelled.");
                //billing.cancelExcess(req.body.id);
            } else {
                res.errorEnd("Unable to cancel the transaction");
            }
        }else{
            res.errorEnd("Unable to locate the transaction");
        }                  
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/new', function(req, res) {
    const ph = require("../../helpers/payments");
    ph.preparePayment(req.body, req.user_property, req, res);
});


module.exports = router;