const express = require("express");
const router = express.Router();
const Properties = require("../../models/properties").AgentProperties;
const MainProperties = require("../../models/properties").Properties;
const Readings = require("../../models/properties").Readings;

const Units = require("../../models/units").Units;
const Unit = require("../../models/units").Unit;
const Users = require("../../models/users").Users;
const Tenants = require("../../models/tenants").Tenants;
const Tenant = require("../../models/tenants").Tenant;
const Notifications = require("../../models/users").Notifications;
const Leases = require("../../models/units").Leases;
const Lease = require("../../models/units").Lease;
const Advert = require("../../models/units").Advert;

const validator = require("../../libs/validator");
const sms = require("../../libs/sms.sender");
const validation_helper = require("../../helpers/validation.helper");
const helpers = require("../../helpers/assorted.helpers");
const file_helpers = require("../../helpers/file.helpers");
const globals = require("../../helpers/global.params");


const uuid = require("uuid");
const moment = require("moment");
const path = require('path');

router.get('/:id?', async function(req, res, next){  
    if(req.params.id){  
        let prop = await Properties.info(req.params.id, req.user_profile.manager_id);
        if(prop){  
            switch(req.query.dest){
                case 'units':
                    if(prop.manage_units){
                        res.renderEjs(req, "agent/all-units", {                    
                            page_title: "Manage Property Units",
                            sub_header: prop.property_name,        
                            property: prop ,
                            active_tab: req.query.dest     
                        });
                    }else{
                        next();
                    }
                    break;
                case 'tenants':
                    if(prop.manage_tenants){
                        res.renderEjs(req, "agent/all-tenants", {                    
                            page_title: "Manage Property Units",
                            sub_header: prop.property_name,        
                            property: prop ,
                            active_tab: req.query.dest     
                        });
                    }else{
                        next();
                    }
                    break;
                case 'leases':
                    if(prop.manage_leases){
                        res.renderEjs(req, "agent/all-leases", {                    
                            page_title: "Manage Property Leases",
                            sub_header: prop.property_name,        
                            property: prop,
                            active_tab: req.query.dest     
                        });
                    }else{
                        next();
                    }                    
                    break;
                default:
                    if(prop.manage_units){
                        res.renderEjs(req, "agent/all-units", {                    
                            page_title: "Manage Property Units",
                            sub_header: prop.property_name,        
                            property: prop ,
                            active_tab: req.query.dest     
                        });
                    }else if(prop.manage_tenants){
                        res.renderEjs(req, "agent/all-tenants", {                    
                            page_title: "Manage Property Units",
                            sub_header: prop.property_name,        
                            property: prop ,
                            active_tab: req.query.dest     
                        });
                    }else if(prop.manage_leases){
                        res.renderEjs(req, "agent/all-leases", {                    
                            page_title: "Manage Property Leases",
                            sub_header: prop.property_name,        
                            property: prop,
                            active_tab: req.query.dest     
                        });
                    }else{
                        next();
                    }               
                  
            }
        }else{
            next();
        }
    }else{
        let props = await Properties.list(req.user_profile.manager_id);   
        res.renderEjs(req, "agent/properties", {
            page_title: "Properties",   
            sub_header: "Assigned Properties",
            props: props       
        });
    }    
});

//units start ///
router.get('/units/new', async function (req, res, next) {
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_units){
                return next();
            }
            let [subscription, available_units] = await Promise.all([
                Users.userSubscription(prop.user_code),
                Units.available(prop.user_code)
            ]);    
            if (available_units < subscription.maximum_units) {
                res.renderEjs(req, "units/agent-new", {
                    page_title: prop.property_name,
                    sub_header: "Add Unit",
                    property: prop,
                });
            } else {
                res.renderEjs(req, "units/agent-max-reached", {
                    page_title: prop.property_name,
                    sub_header: "New Unit",
                });
            }
        }else{
            next();
        }
    }else{
        next();
    }
    
});

router.get('/units/edit/:id', async function (req, res, next) {
    if (req.params.id && req.query.property) {
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);
        if(prop){
            if(!prop.manage_units){
                return next();
            }
            let unit_info = await new Unit(req.query.property, req.params.id);
            if(unit_info.unit_code) {
                res.renderEjs(req, "units/agent-edit", {
                    page_title: prop.property_name,
                    sub_header: "Edit -" + unit_info.unit_name,
                    unit_info: unit_info,
                    property: prop,
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

router.get('/units/info/:id', async function (req, res, next) {
    if (req.params.id && req.query.property) {
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);
        if(prop){
            if(!prop.manage_units){
                return next();
            }
            let unit_info = await Units.fullInfo(prop.property_code, req.params.id);                    
            if(unit_info.unit_code){
                var images = JSON.parse(unit_info.unit_images);           
                var image_paths = [] || images;
                for (var i = 0; i < images.length; i++) {
                    if(!images[i].is_default){
                        image_paths.push(images[i]);
                    }
                    
                }
                unit_info.unit_images = image_paths;
                unit_info.floor = helpers.floorToLabel(unit_info.floor);
                unit_info.rent_amount = helpers.formatMoney(unit_info.rent_amount);
                var ratings = JSON.parse(unit_info.unit_ratings);
                var ratings_message = '<p class="text-warning mb-4">*** No ratings ***</p>';
                if (ratings[0].ratings_count > 0) {
                    switch (ratings[0].average_rating) {
                        case 5:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 4:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 3:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 2:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 1:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        default:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                    }
                }
                unit_info.ratings_message = ratings_message;
                res.renderEjs(req, "units/agent-detailed", {
                    page_title: prop.property_name + ", " + unit_info.unit_name,
                    sub_header: unit_info.unit_name,
                    unit_info: unit_info,
                    property: prop               
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

router.post('/units', async (req, res, next) => {   
    let loader = await new Units();                
    loader.where_data = 'property_code = "'+ req.body.property_code +'"';
    let data = await loader.all(req.body);
    res.json(data);
});

router.post('/units/new', async function (req, res, next) {    
    if(req.body.property){
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);        
        if(prop){
            if(!prop.manage_units){
                return res.errorEnd("Not allowed to manage units!");
            }

            let [subscription, available_units] = await Promise.all([
                Users.userSubscription(prop.user_code),
                Units.available(prop.user_code)
            ]);
            if (available_units < subscription.maximum_units) {
                if (req.body.similar_units) {
                    var n = parseInt(req.body.similar_units);                               
                    if (available_units + n > subscription.maximum_units) {
                        res.errorEnd("Maximum number of units attained. Please upgrade your package");
                    } else {
                        var internet_available = 0 || req.body.internet_available == 1;
                        var tv_cable_available = 0 || req.body.tv_cable_available == 1;
                        var has_balcony = 0 || req.body.has_balcony == 1;
                        var has_garden = 0 || req.body.has_garden == 1;
                        var pet_friendly = 0 || req.body.pet_friendly == 1;
                        var has_closet = 0 || req.body.has_closet == 1;
                        var has_laundry_room = 0 || req.body.has_laundry_room == 1;                           
                        var obj = {
                            internet_available: internet_available,
                            tv_cable_available: tv_cable_available,
                            has_balcony: has_balcony,
                            has_garden: has_garden,
                            pet_friendly: pet_friendly,
                            has_closet:has_closet,
                            has_laundry_room: has_laundry_room,
                            unit_name: req.body.unit_name,                              
                            floor: parseInt(req.body.floor),
                            garages: parseInt(req.body.garages),
                            bedrooms: parseInt(req.body.bedrooms),
                            bathrooms: parseInt(req.body.bathrooms),
                            payment_day: req.body.payment_date,
                            unit_type: req.body.unit_type,
                            electricity_type: req.body.electricity_type,
                            water_source: req.body.water_source,
                            furnishing: req.body.furnishing,
                            floor_type: req.body.floor_type,
                            unit_deposits: req.body.unit_deposits,
                            unit_fixed_bills: req.body.unit_fixed_bills,
                        };
                        
                        var i=0; 
                        
                        while(i < n){                          
                            let nu = await new Unit(prop.property_code);
                            Object.assign(nu, obj);
                            let created = await nu.save(req.body.monthly_rent);
                            if(!created){
                                var obj = {
                                    note_head: "New Unit Failed",
                                    note_message: "An error occured while trying to create a new unit " + back_info.unit_name + " on " + back_info.property_name,
                                    user_code: back_info.user_code,
                                    note_class: "danger",
                                    note_icon: "bx bxs-home-smile",
                                };
                                Notifications.Add(obj);
                            }
                            i++;
                        }                                                        
                        res.successEnd(n + " property unit(s) have been queued. You may have to refresh after a few seconds to see all of them");                                    
                    }
                } else {
                    res.errorEnd("Required fields missing or invalid data");
                }
            } else {
                res.errorEnd("Maximum number of units attained. Please upgrade your package");
            }
        }else{
            next();
        }        
    }else{
        next();
    }    
});

router.post('/units/clone', async function (req, res, next) {    
    if (req.body.unit_code && req.body.unit_name && req.body.property) {
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);
        if(prop){
            if(!prop.manage_units){
                return res.errorEnd("Not allowed to manage units!");
            }

            let clone = await Units.clone(req.body.property, req.body.unit_code, req.body.unit_name);
            if(clone){
                res.successEnd('The selected unit has been cloned');
            }else{
                res.errorEnd("Failed! Unable to clone the selected unit. Please try again later!");
            }     
        }else{
            next();
        }           
    } else {
        res.errorEnd("Failed! Invalid or missing parameters on the request");
    }
});

router.post('/units/delete', async function (req, res, next) {
    if (req.body.unit_code && req.body.property) {
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);
        if(prop){
            if(!prop.manage_units){
                return res.errorEnd("Not allowed to manage units!");
            }
            let nu = await new Unit(req.body.property, req.body.unit_code);
       
            if(nu.unit_code){
                let unit_deleted = await nu.delete();
                if (unit_deleted) {
                    res.successEnd("Unit has been deleted");
                    var images = Units.allImages(nu.unit_code);
                    for (var i = 0; i < images.length; i++) {                                        
                        var filename = images[i].image_id + ".jpg";
                        var fl = path.join(globals.private_dir, "units", filename);
                        file_helpers.delete_file(fl);
                    }
                } else {
                    res.errorEnd("Failed! Only units that don't have any activity can be deleted");
                }
            }else{
                res.errorEnd("Failed! Unit is invalid or already deleted");
            }    
        }else{
            next();
        }                       
        
    } else {
        res.errorEnd("Failed! Invalid or missing parameters");
    }
});

router.post('/units/update', async function (req, res, next) {   
    if (req.body.unit_code && req.body.property) {
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);
        if(prop){
            if(!prop.manage_units){
                return res.errorEnd("Not allowed to manage units!");
            }

            var internet_available = 0 || req.body.internet_available == 1;
            var tv_cable_available = 0 || req.body.tv_cable_available == 1;
            var has_balcony = 0 || req.body.has_balcony == 1;
            var has_garden = 0 || req.body.has_garden == 1;
            var pet_friendly = 0 || req.body.pet_friendly == 1;
            var has_closet = 0 || req.body.has_closet == 1;
            var has_laundry_room = 0 || req.body.has_laundry_room == 1;
            var obj = {
                unit_name: req.body.unit_name,
                floor: req.body.floor,
                garages: req.body.garages,
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                unit_type: req.body.unit_type,
                electricity_type: req.body.electricity_type,
                water_source: req.body.water_source,
                furnishing: req.body.furnishing,
                floor_type: req.body.floor_type,
                internet_available: internet_available,
                tv_cable_available: tv_cable_available,
                has_balcony: has_balcony,
                has_garden: has_garden,
                pet_friendly: pet_friendly,
                has_closet:has_closet,
                has_laundry_room:has_laundry_room,
                unit_deposits: req.body.unit_deposits,
                unit_fixed_bills: req.body.unit_fixed_bills,
            };
            if (req.body.change_rent) {
                obj.payment_day = req.body.payment_date;
            }
    
            let nu = await new Unit(prop.property_code, req.body.unit_code);                 
            Object.assign(nu, obj);
            let unit_updated = await nu.update();
            
            if(unit_updated){
                if (req.body.change_rent) {
                    var rnt = {
                        unit_code: req.body.unit_code,
                        rent_amount: req.body.monthly_rent,
                        effective_from: req.body.effective_from || moment().format(),
                    };
                    let rnt_saved = await Units.addRent(rnt);
                    if (rnt_saved) {
                        res.successEnd("Unit changes has been updated");
                    } else {
                        res.successEnd("Unit changes has been updated, but unable to update new rent");
                    }
                  
                } else {
                    res.successEnd("Unit changes has been updated");
                }
            }else{
                res.errorEnd("Failed! Please check your values and try again");
            }
        }else{
            next();
        }       
       
    } else {
        res.errorEnd("Failed! Invalid/missing parameters");
    }
});

router.post("/units/update-label", async function(req, res, next){
    if (req.body.unit_code && req.body.unit_label && req.body.property) {  
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id); 
        if(prop){
            if(!prop.manage_units){
                return res.errorEnd("Not allowed to manage units!");
            }
            let nu = await new Unit(prop.property_code, req.body.unit_code);                   
            if(nu.unit_code){
                nu.unit_name = req.body.unit_label;
                let unit_updated = await nu.update();
                if (unit_updated) {
                    res.successEnd("Unit name has been updated");
                } else {
                    res.errorEnd("Failed! Please check your values and try again");
                }
            }else{
                res.errorEnd("Failed! Please check your values and try again");
            }     
        }else{
            next();
        }                    
    } else {
        res.errorEnd("Failed! Please check your values and try again");
    }
});

router.post('/units/vacant', async function (req, res, next) {
    let prop = await Properties.info(req.query.property, req.user_profile.manager_id); 
    if(prop){
        if(!prop.manage_units){
            return res.errorEnd("Not allowed to manage units!");
        }
        let vacant_units = await MainProperties.vacantUnits(prop.property_code);
        res.successEndData(vacant_units);
    }else{
        next();
    }   
});

router.post('/units/details', async function (req, res, next) {
    let prop = await Properties.info(req.query.property, req.user_profile.manager_id); 
    if(prop){
        if(!prop.manage_units){
            res.successEndData([]);
        }
        let unit_info = await Units.fullInfo(prop.property_code, req.body.unit_code);
        res.successEndData(unit_info);
    }else{
        res.successEndData([]);
    } 
});

router.post('/units/advert-info', async function (req, res) {    
    if (req.body.id) {
        let ad_info = await Advert.info(req.body.id);
        if(ad_info) {
            res.successEnd(ad_info);
        }else{
            res.errorEnd("Failed! Unable to get advert information. Please try again later!");
        }                    
    } else {
        res.errorEnd("Failed! Unable to get advert information. Please try again later!");
    }
});
//units end ///

///tenants start///

router.post('/tenants/brief', async function (req, res, next){
    let prop = await Properties.info(req.query.property, req.user_profile.manager_id); 
    if(prop){
        if(!prop.manage_units){
            return res.errorEnd("Not allowed to manage units!");
        }
        let brief_tenants = await Tenants.allBrief(prop.property_code);
        res.successEndData(brief_tenants);
    }else{
        next();
    }   
});

router.get('/tenants/image/:property_code', async function (req, res, next) {
    if (req.query.tenant) {        
        let tenant_info = await Tenants.displayImage(req.params.property_code, req.query.tenant);
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

router.get('/tenants/new', async function (req, res, next) {
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            res.renderEjs(req, "tenants/agent-new", {
                page_title: "Add Tenant",
                sub_header: "",        
                property: prop,
            });
        }else{
            next();
        }
    }else{
        next();
    }
    
});

router.get('/tenants/edit/:id', async function (req, res){
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            if (req.params.id) {
                let tenant_info = await new Tenant(prop.property_code, req.params.id);
                if(tenant_info.tenant_id){
                    res.renderEjs(req, "tenants/agent-edit", {                
                        page_title: "Edit Tenant",
                        sub_header: tenant_info.first_name + " " + tenant_info.last_name,                
                        property: prop,
                        tenant_info: tenant_info,
                    });
                }else{
                    next();
                }                    
            } else {
                next();
            }
        }else{
            next();
        }
    }else{
        next();
    }   
});

router.get('/tenants/view/:id', async function (req, res, next){
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            if (req.params.id) {
                let tenant_info = await new Tenant(prop.property_code, req.params.id);
               
                if(tenant_info.tenant_id){         
                    tenant_info.created_on = moment(tenant_info.created_on, 'YYYY-MM-DD HH:mm:ss').toDate();
                
                    res.renderEjs(req, "tenants/agent-tenant-info", { 
                        page_title: "Tenant Information",
                        sub_header: tenant_info.first_name + " " + tenant_info.last_name,                
                        property: prop,
                        tenant_info: tenant_info               
                    });
                }else{
                    next();
                }                   
            } else {
                next();
            }
        }else{
            next();
        }
    }else{
        next();
    } 
});

router.get('/tenants/image/:id', async function (req, res, next){
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            if (req.params.id) {
                let tenant_info = await Tenants.displayImage(prop.property_code, req.params.id);
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
        }else{
            next();
        }
    }else{
        next();
    } 
    
});

router.get('/tenants/front-id/:id', async function (req, res, next){
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            if (req.params.id) {
                let id_front_path = await Tenants.frontId(prop.property_code, req.params.id);
                res.endImage(id_front_path);    
            } else {
                next();
            }
        }else{
            next();
        }
    }else{
        next();
    } 
});

router.get('/tenants/back-id/:id', async function (req, res, next){
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_tenants){
                return next();
            }
            if (req.params.id) {
                let id_back_path = await Tenants.backId(prop.property_code, req.params.id);
                res.endImage(id_back_path);                    
            } else {
                next();
            }
        }else{
            next();
        }
    }else{
        next();
    } 
});

router.post('/tenants/new', async function (req, res, next) {    
    if(req.body.property){
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);        
        if(prop){
            if(!prop.manage_tenants){
                return res.errorEnd("Not allowed to manage tenants!");
            }

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
                let tnt = await new Tenant(prop.property_code);
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
           
        }else{
            next();
        }        
    }else{
        next();
    }    
});

router.post('/tenants/update', async function (req, res, next){
    if(req.body.property){
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);        
        if(prop){
            if(!prop.manage_tenants){
                return res.errorEnd("Not allowed to manage tenants!");
            }

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

                let tenant_info = await new Tenant(prop.property_code, req.body.tenant_id);
                Object.assign(tenant_info, obj);

                let tenant_updated = await tenant_info.update();
                if (tenant_updated) {
                    res.successEnd("Tenant has been updated");
                } else {
                    res.errorEnd("Failed! Please check your values and try again");
                }
            }
           
        }else{
            next();
        }        
    }else{
        next();
    }       
});

router.post('/tenants/delete', async function (req, res, next){
    if (req.body.tenant_id) {
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);        
        if(prop){
            if(!prop.manage_tenants){
                return res.errorEnd("Not allowed to manage tenants!");
            }
            let tenant_info = await new Tenant(req.body.property, req.body.tenant_id);
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
        }else{
            next();
        }             
    } else {
        res.errorEnd("Failed! Cannot complete the command");
    }
});

router.post('/tenants', async function (req, res) {
    let loader = await new Tenants();             
    loader.where_data = 'property_code = "'+ req.body.property_code +'"';
    let data = await loader.all(req.body);   
    res.json(data);
});

router.post('/tenants/quick-update', async function (req, res, next){    
    var validate = validator.Validate(req.body, validation_helper.quickTenant());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        let prop = await Properties.info(req.body.property, req.user_profile.manager_id);  
        if(prop){
            if(!prop.manage_tenants){
                return res.errorEnd("Not allowed to manage tenants!");
            }
        }else{
            return next();
        }
        var obj = {
            first_name: helpers.titleCase(req.body.first_name),
            last_name: helpers.titleCase(req.body.last_name),
            phone_number: req.body.phone_number,
            id_number: req.body.id_number,
        };

        let tnt = await new Tenant(prop.property_code, req.body.tenant_id);
        Object.assign(tnt, obj);

        let tenant_updated = await tnt.update();
        if (tenant_updated) {
            res.successEnd("Tenant details have been updated");
        } else {
            res.errorEnd("Failed! Please check your values and try again");
        }
    }
});

router.post('/tenants/send-sms', async function (req, res, next){
    let prop = await Properties.info(req.body.property, req.user_profile.manager_id);
    if(prop){
        if(!prop.manage_tenants){
            return res.errorEnd("Not allowed to manage tenants!");
        }
    }else{
        return next();
    }

    if (req.body.sms_message.length >= 20 && req.body.sms_message.length <= 320) {
        let tenant_info = await new Tenant(prop.property_code, req.body.tenant_id);
        if(tenant_info.tenant_id){
            var other_info = {
                first_name: tenant_info.first_name,
                phone_number: tenant_info.phone_number,
                unit_name: "",
                property_name: prop.property_name,
                user_code: req.session.user_code,
            };
            sms.sendSms(prop.property_code,tenant_info.phone_number, req.body.sms_message, other_info, (sms_sent, back_info) => {
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
/// units end ///


/// leases start ///
router.post('/leases', async function (req, res, next){
    let prop = await Properties.info(req.body.property, req.user_profile.manager_id); 
    if(prop){
        if(!prop.manage_units){
            return res.errorEnd("Not allowed to manage units!");
        }

        let loader = await new Leases();
        loader.where_data = 'property_code = "'+ req.body.property +'"' ;
        let data = await loader.all(req.body);
        res.json(data);
    }else{
        next();
    }    
});

router.post('/leases/get-single', async function (req, res) {
    let info = await Leases.single(req.body.property, req.body.id);
    if (info) {
        res.successEnd(info);
    } else {
        res.errorEnd("Unable to get the requested lease!");
    }
});

router.post('/leases/edit', async function (req, res) {
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

router.post('/leases/terminate', async function (req, res, next) {
    if (req.body.lease_id && req.body.termination_date) {
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id); 
        if(prop){
            if(!prop.manage_leases){
                res.errorEnd("Not allowed to manage leases");
            }
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

                        let tenant_info = await new Tenant(prop.property_code, t_lease.tenant_id);
                        if (tenant_info.phone_number) {
                            var unit_name = tenant_info.unit_name;
                            if (prop.floors > 1) {
                                unit_name += " - " + helpers.floorToLabel(tenant_info.floor);
                            }
                            unit_name += ", " + prop.property_name;
                            var sms_message = "Dear " + tenant_info.first_name + ", your tenancy at hse " + unit_name + " has been scheduled to be terminated by " + helpers.dateToString(new Date(req.body.termination_date)) + ". You are required to clear any outstanding bills. Your refundable deposits and excess payments if available will be processed afterwards.";
                            var other_info = {
                                first_name: tenant_info.first_name,
                                phone_number: tenant_info.phone_number,
                                unit_name: tenant_info.unit_name,
                                property_name: prop.property_name,
                                user_code: req.session.user_code,
                            };

                            sms.sendSms(prop.property_code, tenant_info.phone_number, sms_message, other_info);
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
        }else{
            next();
        }         
    } else {
        res.errorEnd("Invalid request or missing parameters");
    }
});

router.get('/leases/new', async function (req, res, next) {
    if(req.query.property){
        let prop = await Properties.info(req.query.property, req.user_profile.manager_id);      
        if(prop){
            if(!prop.manage_leases){
                return next();
            }
            var tenant_id = "";
            var unit_code = "";
            if (req.query.tenant_id) {
                tenant_id = req.query.tenant_id;
            }
            if (req.query.unit_code) {
                unit_code = req.query.unit_code;
            }
            res.renderEjs(req, "leases/new-agent", {
                page_title: "New Lease",
                sub_header: "New Lease",                    
                property: prop,
                unit_code: unit_code,
                tenant_id: tenant_id,
            });
        }else{
            next();
        }
    }else{
        next();
    } 
    
});

router.post('/leases/new', async function (req, res, next) {  
    let prop = await Properties.info(req.body.property, req.user_profile.manager_id);  
    if(prop){
        if(!prop.manage_leases){
            return res.errorEnd("Not allowed to manage leases!");
        }
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
                            var file_name = prop.property_code + new_lease.lease_id + "." + ext;
    
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
                    const arr = prop.readable_meters;
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
    
                    let b = await new Bill(prop.property_code);
                    Object.assign(b, bill_obj);
    
                    let bill_added = await b.save(bill_entries);
    
                    if (bill_added) {
                        let tenant_info = await new Tenant(prop.property_code, req.body.tenant_id);
                        let unit_info = await new Unit(prop.property_code, req.body.unit_code);
                        var unit_name = unit_info.unit_name;
                        if (prop.floors > 1) {
                            unit_name += " - " + helpers.floorToLabel(unit_info.floor);
                        }
                        var sms_message = "You have been added as a tenant to " + prop.property_name + ", RM " + unit_name + ". The amount to pay today is " + helpers.formatMoney(total, 2, ".", ",");
                        //send mail
                        var other_info = {
                            first_name: tenant_info.first_name,
                            phone_number: tenant_info.phone_number,
                            unit_name: unit_info.unit_name,
                            property_name: prop.property_name,
                            user_code: req.session.user_code,
                        };
    
                       sms.sendSms(prop.property_code, tenant_info.phone_number, sms_message, other_info);                                
                    }
                } else {
                    res.errorEnd("Unable to create a new lease. Please try again later");
                }
            }
        }
       
    }else{
        next();
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

router.get('/leases/lease-file/:id', function (req, res, next) {
    if (req.params.id) {
        var file_path = path.join(globals.private_dir, 'leases', req.params.id);
        res.serveFile(file_path);
    } else {
        next();
    }
});
///leases end///

///readins start///

router.post("/readings/unit-readings", async function(req, res, next){
    let prop = await Properties.info(req.body.property, req.user_profile.manager_id);
   
    if(prop){
        let rs = await Readings.lastSingle(req.body.unit_code);
        var meters = JSON.parse(prop.readable_meters);
        
        var out_meters = [];
        if(meters){
            for (var i = 0; i < meters.length; i++) {
            
                var ob_name = meters[i]["Meter Name"];
                var ob_value = 0;
                for (var j = 0; j < rs.length; j++){
                    if(rs[j].reading_type == meters[i]["Meter Name"]){
                        var mv = parseFloat(rs[j].read_value) || 0;               
                        ob_value = mv;                               
                        break;
                    }                           
                }
                var obj = {reading_type: ob_name, read_value: ob_value};
                out_meters.push(obj);
            }  
        }                              
        res.successEnd(out_meters);
    }else{
        next();
    } 
});
// readings end///



module.exports = router;