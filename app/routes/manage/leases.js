const express = require("express");
const router = express.Router();
const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");
const file_helpers = require("../../helpers/file.helpers");

const sms = require("../../libs/sms.sender");

const Leases = require("../../models/units").Leases;
const Lease = require("../../models/units").Lease;
const Tenants = require("../../models/tenants").Tenants;
const Tenant = require("../../models/tenants").Tenant;
const Billing = require("../../models/tenants").Bills;
const Bill = require("../../models/tenants").Bill;
const Props = require("../../models/properties").Properties;
const Reading = require("../../models/properties").Reading;
const Units = require("../../models/units").Units;
const Unit = require("../../models/units").Unit;
const Notifications = require("../../models/users").Notifications;

const globals = require("../../helpers/global.params");
const path = require("path");
const uuid = require("uuid");
const moment = require("moment");

router.get('/', function (req, res) {
    res.renderEjs(req, "leases/all", {                    
        page_title: "Manage Property Leases",
        sub_header: req.user_property.property_name,        
        property: req.user_property       
    });
});

router.get('/new', function (req, res) {
    var tenant_id = "";
    var unit_code = "";
    if (req.query.tenant_id) {
        tenant_id = req.query.tenant_id;
    }
    if (req.query.unit_code) {
        unit_code = req.query.unit_code;
    }
    res.renderEjs(req, "leases/new", {
        page_title: "New Lease",
        sub_header: "New Lease",                    
        property: req.user_property,
        unit_code: unit_code,
        tenant_id: tenant_id,
    });
});

router.get('/lease-file/:id', function (req, res, next) {
    if (req.params.id) {
        var file_path = path.join(globals.private_dir, 'leases', req.params.id);
        res.serveFile(file_path);
    } else {
        next();
    }
});

router.post('/', async function (req, res) {
    let loader = await new Leases();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'"' ;
    let data = await loader.all(req.body);
    res.json(data);
});

router.post('/new', async function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.newLease());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        let unit_owner = await Units.currentTenant(req.body.unit_code);
        if (unit_owner) {
            res.errorEnd("The selected unit may have been already assigned to another tenant");
        } else {
            var obj = {
                unit_code: req.body.unit_code,
                tenant_id: req.body.tenant_id,
                lease_date: req.body.lease_date,
                leased_by: req.session.user_code,
                terminated_by: req.session.user_code,
                deposists: req.body.unit_deposits,
                monthly_rent: req.body.monthly_rent,
                fixed_monthly_bills: req.body.unit_fixed_bills,
                bills_payment_date: req.body.payment_date,
                billing_start_date: billing_start_date(req.body.lease_date),
            };

            let new_lease = await new Lease();
            Object.assign(new_lease, obj);

            let lease_added = await new_lease.save();

            if (lease_added) {
                res.successEnd("A new lease has been created");
                if (req.files) {
                    if (Object.keys(req.files).length === 1) {
                        var f = req.files.lease_agreement.name.split(".");
                        var ext = f[f.length - 1];
                        var file_name = req.user_property.property_code + new_lease.lease_id + "." + ext;

                        let lease_file = req.files.lease_agreement;
                        var fl = path.join(globals.private_dir, "leases", file_name);
                        let file_saved = await file_helpers.upload_file(lease_file, fl);
                        if (file_saved) {
                            new_lease.lease_agreement_path = file_name;
                            new_lease.file_extension = "." + ext
                            new_lease.update();
                        }
                    }
                }
                var deps = helpers.string_to_object(req.body.unit_deposits.toString());
                var bills = helpers.string_to_object(req.body.unit_fixed_bills.toString());
                var bill_entries = new Array();
                var curr_month_name = moment(moment().format()).format('MMMM');

                var readings = helpers.string_to_object(req.body.unit_meter_readings.toString());
                const arr = req.user_property.readable_meters;
                for (var i = 0; i < readings.length; i++) {
                    const mobj = arr.filter(result => result['Meter Name'].toString().trim() == readings[i]["Meter Name"].toString().trim()).map(ele => ele);

                    var d_obj = {
                        unit_code: req.body.unit_code,
                        reading_type: mobj[0]["Meter Name"],
                        read_value: parseFloat(readings[i]["Current Reading"]),
                        units_used: 0,
                        read_date: moment().format(),
                        read_by: req.session.user_code,
                        unit_rate: mobj[0].Rate,
                        bill_generated: 0,
                    };
                    let r = await new Reading();
                    Object.assign(r, d_obj);
                    await r.save();
                }


                var bill_id = uuid.v4();
                switch (req.body.this_month_bill) {
                    case "0":
                        //Compute Remaining Days
                        var days = getMonthDaysLeft();
                        var rent = remAmount(days, req.body.monthly_rent);
                        var bill_entry = {
                            bill_name: "Rent " + curr_month_name,
                            bill_id: bill_id,
                            bill_amount: rent,
                        };
                        bill_entries.push(bill_entry);
                        for (var i = 0; i < deps.length; i++) {
                            var t = parseFloat(deps[i]["Amount"]) || 0;
                            bill_entry = {
                                bill_name: deps[i]["Deposit Name"] + " Deposit",
                                bill_id: bill_id,
                                bill_amount: t,
                            };
                            bill_entries.push(bill_entry);
                        }
                        for (var i = 0; i < bills.length; i++) {
                            var t = remAmount(days, parseFloat(bills[i]["Amount"]) || 0);
                            bill_entry = {
                                bill_name: bills[i]["Bill Name"] + " " + curr_month_name,
                                bill_id: bill_id,
                                bill_amount: t,
                            };
                            bill_entries.push(bill_entry);
                        }
                        break;
                    case "2":
                        //Deposits Only
                        for (var i = 0; i < deps.length; i++) {
                            var t = parseFloat(deps[i]["Amount"]) || 0;
                            bill_entry = {
                                bill_name: deps[i]["Deposit Name"] + " Deposit",
                                bill_id: bill_id,
                                bill_amount: t,
                            };
                            bill_entries.push(bill_entry);
                        }
                        break;
                    default:
                        //Full Bill
                        var bill_entry = {
                            bill_name: "Rent " + curr_month_name,
                            bill_id: bill_id,
                            bill_amount: req.body.monthly_rent,
                        };
                        bill_entries.push(bill_entry);
                        for (var i = 0; i < deps.length; i++) {
                            var t = parseFloat(deps[i]["Amount"]) || 0;
                            bill_entry = {
                                bill_name: deps[i]["Deposit Name"] + " Deposit",
                                bill_id: bill_id,
                                bill_amount: t,
                            };
                            bill_entries.push(bill_entry);
                        }
                        for (var i = 0; i < bills.length; i++) {
                            var t = parseFloat(bills[i]["Amount"]) || 0;
                            bill_entry = {
                                bill_name: bills[i]["Bill Name"] + " " + curr_month_name,
                                bill_id: bill_id,
                                bill_amount: t,
                            };
                            bill_entries.push(bill_entry);
                        }
                }
                var total = 0;
                for (var i = 0; i < bill_entries.length; i++) {
                    total += parseInt(Object.values(bill_entries[i])[2]);
                }
                var bill_obj = {
                    bill_id: bill_id,
                    unit_code: req.body.unit_code,
                    bill_date: moment().format(),
                    due_date: req.body.lease_date,
                    tenant_id: req.body.tenant_id,
                    lease_id:new_lease.lease_id
                };

                let b = await new Bill(req.user_property.property_code);
                Object.assign(b, bill_obj);

                let bill_added = await b.save(bill_entries);

                if (bill_added) {
                    let tenant_info = await new Tenant(req.user_property.property_code, req.body.tenant_id);
                    let unit_info = await new Unit(req.user_property.property_code, req.body.unit_code);
                    var unit_name = unit_info.unit_name;
                    if (req.user_property.floors > 1) {
                        unit_name += " - " + helpers.floorToLabel(unit_info.floor);
                    }
                    var sms_message = "You have been added as a tenant to " + req.user_property.property_name + ", RM " + unit_name + ". The amount to pay today is " + helpers.formatMoney(total, 2, ".", ",");
                    //send mail
                    var other_info = {
                        first_name: tenant_info.first_name,
                        phone_number: tenant_info.phone_number,
                        unit_name: unit_info.unit_name,
                        property_name: req.user_property.property_name,
                        user_code: req.session.user_code,
                    };

                   sms.sendSms(req.user_property.property_code, tenant_info.phone_number, sms_message, other_info);                                
                }
            } else {
                res.errorEnd("Unable to create a new lease. Please try again later");
            }
        }
    }
});

router.post('/terminate', async function (req, res) {
    if (req.body.lease_id && req.body.termination_date) {

        let t_lease = await new Lease(req.body.lease_id);
        if (t_lease.lease_id) {
            var a = moment(moment().format());
            var b = moment(new Date(req.body.termination_date));
            var diff_days = b.diff(a, "days");
            if (diff_days >= 0) {

                t_lease.expiry_date = new Date(req.body.termination_date);
                t_lease.terminated_by = req.session.user_code;
                let terminated = await t_lease.update();
                if (terminated) {
                    res.successEnd("Tenancy for the specified unit has been scheduled for termination");

                    let tenant_info = await new Tenant(req.user_property.property_code, t_lease.tenant_id);
                    if (tenant_info.phone_number) {
                        var unit_name = tenant_info.unit_name;
                        if (req.user_property.floors > 1) {
                            unit_name += " - " + helpers.floorToLabel(tenant_info.floor);
                        }
                        unit_name += ", " + req.user_property.property_name;
                        var sms_message = "Dear " + tenant_info.first_name + ", your tenancy at hse " + unit_name + " has been scheduled to be terminated by " + helpers.dateToString(new Date(req.body.termination_date)) + ". You are required to clear any outstanding bills. Your refundable deposits and excess payments if available will be processed afterwards.";
                        var other_info = {
                            first_name: tenant_info.first_name,
                            phone_number: tenant_info.phone_number,
                            unit_name: tenant_info.unit_name,
                            property_name: req.user_property.property_name,
                            user_code: req.session.user_code,
                        };

                        sms.sendSms(req.user_property.property_code, tenant_info.phone_number, sms_message, other_info);
                    }
                } else {
                    res.errorEnd("Unable to terminate tenancy. Make sure the unit is available and occupied.");
                }
            } else {
                res.errorEnd("Termination date cannot be less than " + helpers.dateToString(moment().format()));
            }
        } else {
            res.errorEnd("Tenancy already terminated or unit no longer exists.");
        }
    } else {
        res.errorEnd("Invalid request or missing parameters");
    }
});

router.post('/get-single', async function (req, res) {
    let info = await Leases.single(req.user_property.property_code, req.body.id);
    if (info) {
        res.successEnd(info);
    } else {
        res.errorEnd("Unable to get the requested lease!");
    }
});

router.post('/edit', async function (req, res) {
    if (req.body.edit_lease_id && req.body.payment_date && req.body.monthly_rent) {
        let edit_lease = await new Lease(req.body.edit_lease_id);
        var bills = req.body.unit_fixed_bills || '[]';
        edit_lease.monthly_rent = req.body.monthly_rent;
        edit_lease.fixed_monthly_bills = bills;
        edit_lease.bills_payment_date = req.body.payment_date;
        let updated = await edit_lease.update();
        if (updated) {
            res.successEnd("Lease edits have been saved!");
        } else {
            res.errorEnd("Unable to save lease edits. Please try again later!");
        }
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

function billing_start_date(lease_date) {
    var now = new Date(lease_date);
    if (now.getMonth() == 11) {
        return new Date(now.getFullYear() + 1, 0, 1);
    } else {
        let mm = `0${parseInt(now.getMonth()) + 2}`;
        return new Date(`${now.getFullYear()}-${mm.substring(-2)}-01`)
    }
}

function remAmount(amt, days) {
    return parseInt((days * amt) / 30);
}
function getMonthDaysLeft() {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate();
}


module.exports = router;