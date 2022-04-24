const express = require("express");
const router = express.Router();
const moment = require("moment");
const uuid = require("uuid");
const path = require("path");

const Tenants = require("../../models/tenants").Tenants;
const Tenant = require("../../models/tenants").Tenant;
const Payments = require("../../models/tenants").Payments;
const Bills = require("../../models/tenants").Bills;
const Notifications = require("../../models/users").Notifications;
const Leases = require("../../models/units").Leases;


const validator = require("../../libs/validator");
const sms = require("../../libs/sms.sender");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");
const file_helpers = require("../../helpers/file.helpers");
const globals = require("../../helpers/global.params");

router.get('/', function (req, res){
    res.renderEjs(req, "tenants/all-tenants", {                    
        page_title: "Manage Property Tenants",
        sub_header: req.user_property.property_name,        
        property: req.user_property,
    });
});

router.get('/new', function (req, res){
    res.renderEjs(req, "tenants/new", {
        page_title: "Add Tenant",
        sub_header: "",        
        property: req.user_property,
    });
});

router.get('/edit/:id', async function (req, res){
    if (req.params.id) {
        let tenant_info = await new Tenant(req.user_property.property_code, req.params.id);
        if(tenant_info.tenant_id){
            res.renderEjs(req, "tenants/edit", {                
                page_title: "Edit Tenant",
                sub_header: tenant_info.first_name + " " + tenant_info.last_name,                
                property: req.user_property,
                tenant_info: tenant_info,
            });
        }else{
            next();
        }                    
    } else {
        next();
    }
});

router.get('/image/:id', async function (req, res){
    if (req.params.id) {
        let tenant_info = await Tenants.displayImage(req.user_property.property_code, req.params.id);
        if(tenant_info.tenant_id){
            if (tenant_info.first_name === null || tenant_info.first_name === "") {
                next();
            }else{
                var initials = tenant_info.first_name.charAt(0).toUpperCase();
                res.endImage(tenant_info.image_path, initials, tenant_info.default_color);                            
            }
        }else{
            next();
        }                   
    } else {
        next();
    }
});

router.get('/id-front/:id', async function (req, res){
    if (req.params.id) {
        let id_front_path = await Tenants.frontId(req.user_property.property_code, req.params.id);
        res.endImage(id_front_path);    
    } else {
        next();
    }
});

router.get('/id-back/:id', async function (req, res){
    if (req.params.id) {
        let id_back_path = await Tenants.backId(req.user_property.property_code, req.params.id);
        res.endImage(id_back_path);                    
    } else {
        next();
    }
});

router.get('/view/:id', async function (req, res, next){
    if (req.params.id) {
        let tenant_info = await new Tenant(req.user_property.property_code, req.params.id);
       
        if(tenant_info.tenant_id){         
            tenant_info.created_on = moment(tenant_info.created_on, 'YYYY-MM-DD HH:mm:ss').toDate();
        
            res.renderEjs(req, "tenants/tenant-info", { 
                page_title: "Tenant Information",
                sub_header: tenant_info.first_name + " " + tenant_info.last_name,                
                property: req.user_property,
                tenant_info: tenant_info               
            });
        }else{
            next();
        }                   
    } else {
        next();
    }
});

//########################################################################

router.post('/', async function (req, res){
    let loader = await new Tenants();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'"';
    let data = await loader.all(req.body);
    res.json(data);
});

router.post('/brief', async function (req, res){
    let brief_tenants = await Tenants.allBrief(req.user_property.property_code);
    res.successEndData(brief_tenants);
});

router.post('/update-quick', async function (req, res){
    var validate = validator.Validate(req.body, validation_helper.quickTenant());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var obj = {
            first_name: helpers.titleCase(req.body.first_name),
            last_name: helpers.titleCase(req.body.last_name),
            phone_number: req.body.phone_number,
            id_number: req.body.id_number,
        };

        let tnt = await new Tenant(req.user_property.property_code, req.body.tenant_id);
        Object.assign(tnt, obj);

        let tenant_updated = await tnt.update();
        if (tenant_updated) {
            res.successEnd("Tenant details have been updated");
        } else {
            res.errorEnd("Failed! Please check your values and try again");
        }
    }
});

router.post('/update', async function (req, res){
    var validate = validator.Validate(req.body, validation_helper.updateTenant());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var obj = {
            gender: req.body.gender,
            first_name: helpers.titleCase(req.body.first_name),
            last_name: helpers.titleCase(req.body.last_name),
            phone_number: req.body.phone_number,
            id_number: req.body.id_number,
            alt_phone_number: req.body.alt_phone_number,
            email_address: req.body.email_address,
            nationality: helpers.titleCase(req.body.nationality),
            next_of_kins: req.body.next_of_kins,
        };

        let tenant_info = await new Tenant(req.user_property.property_code, req.body.tenant_id);
        Object.assign(tenant_info, obj);

        let tenant_updated = await tenant_info.update();
        if (tenant_updated) {
            res.successEnd("Tenant has been updated");
        } else {
            res.errorEnd("Failed! Please check your values and try again");
        }
    }
});

router.post('/delete', async function (req, res){
    if (req.body.tenant_id) {
        let tenant_info = await new Tenant(req.user_property.property_code, req.body.tenant_id);
        if(tenant_info.tenant_id){
            let tenant_deleted = await tenant_info.delete();
            if (tenant_deleted) {
                res.successEnd("Tenant has been deleted");
                file_helpers.delete_file(tenant_info.image_path);
                file_helpers.delete_file(tenant_info.id_back_path);
                file_helpers.delete_file(tenant_info.id_front_path);
            } else {
                res.errorEnd("Failed! Only allowed to delete tenants who have not ever been assigned a unit");
            }
        }else{
            res.errorEnd("Failed! Cannot complete the command right now");
        }                   
    } else {
        res.errorEnd("Failed! Cannot complete the command");
    }
});

router.post('/new', async function (req, res){
    var validate = validator.Validate(req.body, validation_helper.newTenant());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {                   
        var obj = {                        
            gender: req.body.gender,
            first_name: helpers.titleCase(req.body.first_name),
            last_name: helpers.titleCase(req.body.last_name),
            id_number: req.body.id_number,
            phone_number: req.body.phone_number,
            alt_phone_number: req.body.alt_phone_number,
            email_address: req.body.email_address,
            nationality: helpers.titleCase(req.body.nationality),
            next_of_kins: req.body.next_of_kins,
            date_of_birth: req.body.date_of_birth,                                             
        };
        let tnt = await new Tenant(req.user_property.property_code);
        Object.assign(tnt, obj);
        let tenant_saved = await tnt.save();
        if (tenant_saved) {
            res.successEnd("Tenant account created successfully");
            if (req.body.tenant_image) {
                var tenant_image = Buffer.from(req.body.tenant_image, "base64");
                var filename = uuid.v4();
                filename += ".jpg";
                var fl = path.join(globals.private_dir, "tenants", "profiles", filename);              
                let created = await file_helpers.createFile(tenant_image, fl);
                if (created) {
                    tnt.image_path = fl;
                    tnt.update(); 
                }
            }
            if (req.body.id_front_image) {
                data = Buffer.from(req.body.id_front_image, "base64");
                filename = uuid.v4();
                filename += ".jpg";
                var fl = path.join(globals.private_dir, "tenants", "ids", filename);               
                let created = await file_helpers.createFile(data, fl);
                if (created) {
                    tnt.id_front_path =fl;
                    tnt.update();                                     
                }
            }

            if (req.body.id_back_image) {
                var id_back_image = Buffer.from(req.body.id_back_image, "base64");
                var filename = uuid.v4();
                filename += ".jpg";
                var fl = path.join(globals.private_dir, "tenants", "ids", filename);             
                let created = await file_helpers.createFile(id_back_image, fl);
                if (created) {
                    tnt.id_back_path = fl;
                    tnt.update(); 
                }
            }
        } else {
            res.errorEnd("Unable to create tenant account. Please check your data and try again!");
        }
        
    }
});

router.post('/send-broadscast-sms', async function (req, res){
    var validate = validator.Validate(req.body, validation_helper.tenantsBroadcastSMS());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var floors = req.body.tenancy_floor || Array.from(Array(req.user_property.floors).keys());
        let tenant_result = await Tenants.assigned(req.user_property.property_code, floors);
        if(tenant_result.length>0){
            res.successEnd("The broadcast messages have been queued");

            for (var i = 0; i < tenant_result.length; i++) {
                var sms_message = req.body.sms_template;

                var replacer = new RegExp("{first_name}", "g");
                sms_message = sms_message.replace(replacer, tenant_result[i].first_name);

                replacer = new RegExp("{last_name}", "g");
                sms_message = sms_message.replace(replacer, tenant_result[i].last_name);

                replacer = new RegExp("{property_name}", "g");
                sms_message = sms_message.replace(replacer, req.user_property.property_name);

                replacer = new RegExp("{unit_name}", "g");
                sms_message = sms_message.replace(replacer, tenant_result[i].unit_name);

                replacer = new RegExp("{email_address}", "g");
                sms_message = sms_message.replace(replacer, tenant_result[i].email_address);

                var other_info = {
                    first_name: tenant_result[i].first_name,
                    phone_number: tenant_result[i].phone_number,
                    unit_name: tenant_result[i].unit_name,
                    property_name: req.user_property.property_name,
                    user_code: req.session.user_code,
                };
                sms.sendSms(req.user_property.property_code, tenant_result[i].phone_number, sms_message, other_info);                            
            }
        }else{
            res.errorEnd("The selected floor(s) does not have active tenants");
        }                   
    }
});

router.post('/tenant-leases', async function (req, res){
    let loader = await new Leases();                
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND tenant_id = "' +req.body.tenant_id +'"';
    let leases_data = await loader.all(req.body);
    res.json(leases_data); 
});

router.post('/tenant-invoices', async function (req, res){
    let loader = await new Bills();                
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND tenant_id = "' +req.body.tenant_id +'"';
    let bills_data = await loader.all(req.body);
    res.json(bills_data);     
});

router.post('/tenant-payments', async function (req, res){
    let loader = await new Payments();                
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND tenant_id = "' +req.body.tenant_id +'"';
    let payments_data = await loader.all(req.body);
    res.json(payments_data);  
});

router.post('/accounts-info', async function (req, res){
    let accounts_info = await Tenants.accountsInfo(req.body.tenant_id);
    res.successEndData(accounts_info);
});

router.post('/send-sms', async function (req, res){
    if (req.body.sms_message.length >= 20 && req.body.sms_message.length <= 320) {
        let tenant_info = await new Tenant(req.user_property.property_code, req.body.tenant_id);
        if(tenant_info.tenant_id){
            var other_info = {
                first_name: tenant_info.first_name,
                phone_number: tenant_info.phone_number,
                unit_name: "",
                property_name: req.user_property.property_name,
                user_code: req.session.user_code,
            };
            sms.sendSms(req.user_property.property_code,tenant_info.phone_number, req.body.sms_message, other_info, (sms_sent, back_info) => {
                if (!sms_sent) {
                    var obj = {
                        note_head: "SMS Failed",
                        note_message: "SMS to " + back_info.first_name + " - " + back_info.phone_number + " of " + back_info.property_name + " could not be sent!",
                        user_code: back_info.user_code,
                        note_class: "danger",
                        note_icon: "bx bxs-message-rounded",
                    };
                    Notifications.Add(obj);
                }
            });
            res.successEnd("SMS Message has been sent to the tenant");
        }else{
            res.errorEnd("Invalid tenant. Please try again later");
        }
       
    } else {
        res.errorEnd("Message does not meet the requirements");
    }
});


module.exports = router;