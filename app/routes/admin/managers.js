const express = require("express");
const router = express.Router();
const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");

const uuid = require("uuid");
const moment = require("moment");

const Managers = require("../../models/properties").Managers;
const user_groups = require("../../models/properties").UserGroups;
const props = require("../../models/properties").Properties;
const Users = require("../../models/users").Users;


router.get("/", async (req, res) => { 
  let props_list = await props.getBriefAll(req.session.user_code);
  res.renderEjs(req, "agents/all-agents", {
    page_title: "Management",
    sub_header: "Agents & Managers",
    property_list: props_list   
  });   

});

router.post("/", async (req, res) => {
  let loader = await new Managers();                
  loader.where_data = 'user_code = "'+ req.session.user_code +'"';
  let data = await loader.all(req.body);
  res.json(data);
});

router.post("/change-status", async (req, res) => {
    if (req.body.id) {
        var state = req.body.state || 0;       
        let updated = await Managers.activate(req.session.user_code, req.body.id, state);
        if (updated) {           
            res.successEnd('A manager account status has been updated.');
        } else {
            res.errorEnd("Unable to change the manager status. Please try again later!");
        }
    } else {
        res.errorEnd("Invalid or missing required data!");
    }
});

router.get("/exists", async function(req, res, next) {
    if (req.query.email_address) {
        var email = decodeURIComponent(req.query.email_address);
        let registered = await Managers.emailAvailable(req.session.user_code,email);
        res.json(registered? false: true);
    } else {
        next();
    }
});

router.post("/detailed", async (req, res) => {
    let info = await Managers.info(req.session.user_code, req.body.id);
    if (info) {
        res.successEnd(info);
    } else {
        res.errorEnd("Unable to fetch the manager details. Please try again later.");
    }
});

router.post("/delete", async (req, res) => {
    let deleted = await Managers.delete(req.session.user_code, req.body.id);
    if (deleted) {
        res.successEnd("The manager has been deleted");
    } else {
        res.errorEnd("Unable to delete the manager account");
    }
});

router.post("/new", async (req, res) => {
    var validate = validator.Validate(
        req.body,
        validation_helper.newPropertyManager()
    );
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        let available = await Managers.available(req.session.user_code);
        if (available < 20) {
            let registered = await Managers.emailAvailable(req.body.user_code, req.body.email_address);
            if (registered) {
                res.errorEnd("A manager with this email already exists");
            } else {
                let subscription = await Users.userSubscription(req.session.user_code);
                if (subscription.package_id === "vy0is4ez65sq" && available > 2) {
                    res.errorEnd("Only 3 manager allowed in DEMO!");
                } else {
                    var new_manager = {
                        manager_id: uuid.v4(),
                        email_address: req.body.email_address,
                        phone_number: req.body.phone_number,
                        first_name:  helpers.titleCase(req.body.first_name),
                        last_name:  helpers.titleCase(req.body.last_name),
                        user_code: req.session.user_code,
                        added_on: moment().format()
                    };
                    let added = await Managers.add(new_manager);
                    if (added) {
                        res.successEnd("A new property manager has been added");
                    } else {
                        res.errorEnd("Unable to add a new property manager. Please try again later");
                    }
                }
            }
        } else {
            res.errorEnd("You are allowed to add a maximum of 20 managers");
        } 
    }
});

router.post("/update", async (req, res) => {
    var validate = validator.Validate(
        req.body,
        validation_helper.newPropertyManager()
    );
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {       
        let owner = await Managers.isEmailOwner(req.body.manager_id, req.body.email_address);      
        if(!owner){
            res.errorEnd("A different manager with this email already exists!");
        }else{
            var new_manager = {
                email_address: req.body.email_address,
                phone_number: req.body.phone_number,
                first_name:  helpers.titleCase(req.body.first_name),
                last_name:  helpers.titleCase(req.body.last_name)               
            };
            let updated = await Managers.update(req.session.user_code, new_manager, req.body.manager_id);
            if (updated) {
                res.successEnd("Property manager details have been updated");
            } else {
                res.errorEnd("Unable to add update property manager details. Please try again later");
            }
        }        
    }
});

router.post('/get-properties', async function(req, res){
    let props = await Managers.unassigned(req.body.id, req.session.user_code);   
    if(props.length>0){
        res.successEnd(props);
    }else{
        res.errorEnd("Failed. You have no property to assign to this manager!");  
    }
});


router.post('/assign-property', async function(req, res){
    let obj = {
        manager_id: req.body.manager_id,
        property_code: req.body.property_code,      
        manage_units: req.body.manage_units,
        manage_tenants: req.body.manage_tenants,
        manage_leases: req.body.manage_leases,
        manage_expenses: req.body.manage_expenses,
        manage_payments: req.body.manage_payments,
        meter_readings: req.body.meter_readings,
        manage_images: req.body.manage_images
    };

    let assigned = await Managers.assign(obj);
    if(assigned){
        res.successEnd('The property has been assigned successfully to the manager.');
    }else{
        res.errorEnd("Failed. Unable to assign the property to the manager. Please try again later!");  
    }
});

router.post('/remove-property', async function(req, res){
    if(req.body.property_code && req.body.manager_id){
        let removed = await Managers.remove(req.body.property_code, req.body.manager_id);
        if(removed){
            res.successEnd('The property has been removed successfully from the manager.');
        }else{
            res.errorEnd("Failed. Unable to remove the property from the manager. Please try again later!");  
        }
    }else{
        res.errorEnd("Failed. Unable to remove the property from the manager. Invalid or missing parameters!"); 
    }   
});

router.post('/get-rights', async function(req, res){
    if(req.body.property_code && req.body.manager_id){
        let rights = await Managers.rights(req.body.property_code, req.body.manager_id);
        if(rights){
            res.successEnd(rights);
        }else{
            res.errorEnd("Failed. Unable to get rights for the property manager. Please try again later!");  
        }
    }else{
        res.errorEnd("Failed. Invalid or missing parameters!"); 
    }   
});

router.post('/update-rights', async function(req, res){
    let obj = {       
        manage_units: req.body.manage_units||0,
        manage_tenants: req.body.manage_tenants||0,
        manage_leases: req.body.manage_leases||0,
        manage_expenses: req.body.manage_expenses||0,
        manage_payments: req.body.manage_payments||0,
        meter_readings: req.body.meter_readings||0,
        manage_images: req.body.manage_images||0
    };

    let assigned = await Managers.update_rights(obj, {manager_id: req.body.manager_id, property_code: req.body.property_code});
    if(assigned){
        res.successEnd('The property has been assigned successfully to the manager.');
    }else{
        res.errorEnd("Failed. Unable to assign the property to the manager. Please try again later!");  
    }
});

module.exports = router;
