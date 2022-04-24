const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const path = require("path");
const moment = require("moment");

const Users = require("../../models/users").Users;
const Units = require("../../models/units").Units;
const Unit = require("../../models/units").Unit;
const Advert = require("../../models/units").Advert;
const Properties = require("../../models/properties").Properties;
const Notifications = require("../../models/users").Notifications;
const Leases = require("../../models/units").Leases;
const RentHistory = require("../../models/units").RentHistory;
const Payments = require("../../models/units").PaymentsHistory;
const Invoices = require("../../models/units").InvoicesHistory;

const helpers = require("../../helpers/assorted.helpers");
const globals = require("../../helpers/global.params");
const file_helpers = require("../../helpers/file.helpers");

router.get('/', function (req, res) {
    res.renderEjs(req, "units/all", {                    
        page_title: "Manage Property Units",
        sub_header: req.user_property.property_name,        
        property: req.user_property       
    });
});

router.get('/new', async function (req, res) {
    let [subscription, available_units] = await Promise.all([
        Users.userSubscription(req.session.user_code),
        Units.available(req.session.user_code)
    ]);    
    if (available_units < subscription.maximum_units) {
        res.renderEjs(req, "units/new", {
            page_title: req.user_property.property_name,
            sub_header: "Add Unit",
            property: req.user_property,
        });
    } else {
        res.renderEjs(req, "units/max-reached", {
            page_title: req.user_property.property_name,
            sub_header: "New Unit",
        });
    }
});

router.get('/edit/:id', async function (req, res, next) {
    if (req.params.id) {
        let unit_info = await new Unit(req.user_property.property_code, req.params.id);
        if(unit_info.unit_code) {
            res.renderEjs(req, "units/edit", {
                page_title: req.user_property.property_name,
                sub_header: "Edit -" + unit_info.unit_name,
                unit_info: unit_info,
                property: req.user_property,
            });
        }else{
            next();
        }                    
    } else {
        next();
    }
});

router.get('/advertise', async function (req, res, next) {
    if (req.query.unit) {
        let unit_info = await new Unit(req.user_property.property_code, req.query.unit);
        if(unit_info.unit_code) {
            let ad_info = {};
            ad_info.viewing_fees="0.00";
            ad_info.ad_comments="";
            if(unit_info.ad_id){          
                 ad_info = await new Advert(unit_info.ad_id);
            }   

           
            unit_info.floor = helpers.floorToLabel(unit_info.floor);
            unit_info.rent_amount = helpers.formatMoney(unit_info.rent_amount);

            res.renderEjs(req, "units/advertise", {
                page_title: "Advertise -" + unit_info.unit_name,
                sub_header: "Advertise -" + unit_info.unit_name,
                unit_info: unit_info,
                ad_info: ad_info,
                property: req.user_property,
            });

        }else{
            next();
        }                    
    } else {
        next();
    }
});

router.get('/info/:id', async function (req, res, next) {
    if (req.params.id) {
        let unit_info = await Units.fullInfo(req.user_property.property_code, req.params.id);                    
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
            res.renderEjs(req, "units/detailed", {
                page_title: req.user_property.property_name + ", " + unit_info.unit_name,
                sub_header: unit_info.unit_name,
                unit_info: unit_info,
                property: req.user_property               
            });
        }else{
            next();
        }
    } else {
        next();
    }
});

//###################################

router.post('/advertise', async function (req, res, next) {    
    if (req.query.unit) {
        let unit_info = await new Unit(req.user_property.property_code, req.query.unit);
        if(unit_info.unit_code) {
            let ad;
            if(unit_info.ad_id){          
                ad = await new Advert(unit_info.ad_id);
                ad.added_by = req.session.user_code;
                ad.viewing_fees = req.body.viewing_fees;
                ad.ad_comments = req.body.ad_comments;
                ad.unit_code = unit_info.unit_code;
                let ok = await ad.update();
            }else{
                ad = await new Advert();
                ad.added_by = req.session.user_code;
                ad.viewing_fees = req.body.viewing_fees;
                ad.ad_comments = req.body.ad_comments;
                ad.unit_code = unit_info.unit_code;
                let ok = await ad.save();
                if(ok){
                    res.successEnd("The advert for the selected unit has been published.");
                }else{
                    res.errorEnd("Failed! Unable to create an advert. Please try again later!");
                }                
            } 

        }else{
            next();
        }                    
    } else {
        next();
    }
});

router.post('/advert', async function (req, res) {    
    if (req.query.ad) {
        let ad_info = await Advert.info(req.query.ad);
        if(ad_info) {
            res.successEnd(ad_info);
        }else{
            res.errorEnd("Failed! Unable to get advert information. Please try again later!");
        }                    
    } else {
        res.errorEnd("Failed! Unable to get advert information. Please try again later!");
    }
});

router.post('/end-advert', async function (req, res) {    
    if (req.body.ad_id) {
        let ended = await Advert.end(req.body.ad_id);
        if(ended) {
            res.successEnd("The selected ad has been stopped");
        }else{
            res.errorEnd("Failed! Unable to stop the selected ad. Please try again later!");
        }                    
    } else {
        res.errorEnd("Failed! Unable to get advert information. Please try again later!");
    }
});

router.post('/', async function (req, res) {
    let loader = await new Units();                
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'"';
    let data = await loader.all(req.body);
    res.json(data);
});

router.post("/update-label", async function(req, res){
    if (req.body.unit_code && req.body.unit_label) {        
        let nu = await new Unit(req.user_property.property_code, req.body.unit_code);                   
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
    } else {
        res.errorEnd("Failed! Please check your values and try again");
    }
});

router.post('/delete', async function (req, res) {
    if (req.body.unit_code) {
        let nu = await new Unit(req.user_property.property_code, req.body.unit_code);
       
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
        
    } else {
        res.errorEnd("Failed! Invalid or missing parameters");
    }
});

router.post('/vacant', async function (req, res) {
    let vacant_units = await Properties.vacantUnits(req.user_property.property_code);
    res.successEndData(vacant_units);
});

router.post('/brief', async function (req, res) {
    let brief_units = await Units.brief(req.user_property.property_code);               
    res.successEndData(brief_units); 
});

router.post('/list', async function (req, res) {
    let brief_units = await Units.brief(req.user_property.property_code);
    res.successEnd(brief_units); 
});

router.post('/details', async function (req, res) {
    if (req.body.unit_code) {
        let unit_info = await Units.fullInfo(req.user_property.property_code, req.body.unit_code);
        res.successEndData(unit_info);
    } else {
        res.successEndData([]);
    }
});

router.post('/new', async function (req, res) {
    let [subscription, available_units] = await Promise.all([
        Users.userSubscription(req.session.user_code),
        Units.available(req.session.user_code)
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
                    let nu = await new Unit(req.user_property.property_code);
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
});

router.post('/update', async function (req, res) {
    if (req.body.unit_code) {
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

        let nu = await new Unit(req.user_property.property_code, req.body.unit_code);                 
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
       
    } else {
        res.errorEnd("Failed! Invalid/missing parameters");
    }
});

router.post('/owner', async function (req, res) {
    if (req.body.unit_code) {
        let owner_info = await Units.currentTenant(req.body.unit_code);
        if(owner_info){
            res.successEnd(owner_info);
        }else{
            res.errorEnd("Unit is not currently occupied");
        }
    } else {
        res.errorEnd("Invalid unit!");
    }
});

router.post('/upload-image', async function (req, res) {
    if (req.body.unit_code && req.body.image_data) {
        let nu = await new Unit(req.user_property.property_code, req.body.unit_code);
        if(nu.unit_code){
            let images = await Units.images(nu.unit_code);
            if (images.length < 6) {
                var image_data = Buffer.from(req.body.image_data, "base64");
                var file_id = uuid.v4();
                var filename = file_id + ".jpg";
                var fl = path.join(globals.private_dir, "units", filename);
                let created = await file_helpers.createFile(image_data, fl);
                if (created) {
                    var image_info = {
                        image_id: file_id,
                        unit_code: req.body.unit_code,
                        image_description: req.body.description,
                    };
                    let updated = await Units.addImage(image_info);
                    if (updated) {
                        res.successEnd("A new unit image has been uploaded");
                    } else {
                        file_helpers.delete_file(fl);
                        res.errorEnd("Unable to add a new image. Please try again later");
                    }
                } else {
                    res.errorEnd("Unable to add unit image");
                }            
            } else {
                res.errorEnd("You have attained a maximum number of pictures for this property unit");
            }
        }else{
            res.errorEnd("Failed! Invalid unit or missing parameters");
        }                   
    } else {
        res.errorEnd("Failed! Invalid or missing parameters");
    }
});

router.post('/set-display-picture', async function (req, res) {
    if (req.body.unit_code && req.body.image_data ) {
        let unit_info = await new Unit(req.user_property.property_code, req.body.unit_code);
        if(unit_info.unit_code){
            var image_data = Buffer.from(req.body.image_data, "base64");
            var file_id = uuid.v4();
            var filename = file_id + ".jpg";
            var fl = path.join(globals.private_dir, "units", filename);
            let created = await file_helpers.createFile(image_data, fl);
            if (created) {
                var image_info = {
                    image_id: file_id,
                    unit_code: req.body.unit_code,
                    is_default: true,
                };
                let updated = await Units.addImage(image_info);
                if (updated) {
                    res.successEnd("A new unit profile image has been set");
                } else {
                    file_helpers.delete_file(fl);
                    res.errorEnd("Unable to set a new profile image. Please try again later");
                }
            } else {
                res.errorEnd("Unable to set unit profile image");
            }
        }else{
            res.errorEnd("Failed! Invalid unit or missing parameters");
        }                   
    } else {
        res.errorEnd("Failed! Invalid or missing parameters");
    }
});

router.post('/delete-image', async function (req, res) {
    if (req.body.image_id) {
        let deleted = Units.deleteImage(req.body.image_id);
        if (deleted) {
            res.successEnd("The picture has been deleted");
            var filename = req.body.image_id + ".jpg";
            var fl = path.join(globals.private_dir, "units", filename);
            file_helpers.delete_file(fl);
        } else {
            res.errorEnd("Unable to delete picture. Invalid or missing parameters");
        }
    } else {
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/rent-history', async function (req, res) {
    if (req.body.unit_code) {
        let loader = await new RentHistory();
        loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND unit_code = "' + req.body.unit_code +'"';
        let data = await loader.all(req.body);
        res.json(data);
    } else {
        res.json([]);
    }
});

router.post('/leases-history', async function (req, res) {
    if (req.body.unit_code) {
        let loader = await new Leases();
        loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND unit_code = "' + req.body.unit_code +'"';
        let data = await loader.all(req.body);
        res.json(data);
    } else {
        res.json([]);
    }
});

router.post('/tenant-invoices', async function (req, res) {
    if (req.body.unit_code) {
        let loader = await new Invoices();
        loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND unit_code = "' + req.body.unit_code +'"';
        let data = await loader.all(req.body);
        res.json(data);
    } else {
        res.json([]);
    }
});

router.post('/tenant-payments', async function (req, res) {
    if (req.body.unit_code) {
        let loader = await new Payments();
        loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND unit_code = "' + req.body.unit_code +'"';
        let data = await loader.all(req.body);
        res.json(data);
    } else {
        res.json([]);
    }
});

router.post('/unit-balances', async function (req, res) {
    if (req.body.unit_code) {
        let info = await Units.unitValues(req.user_property.property_code,req.body.unit_code);
        res.successEndData(info);
    } else {
        res.successEndData([]);
    }
});

router.post('/readings-history', async function (req, res) {
    if (req.body.unit_code) {
        let reading_history = await Units.getReadingHistory(req.body.unit_code);
        reading_history = reading_history || [];
        res.successEnd(reading_history);
    } else {
        res.errorEnd("Failed! Invalid or missing parameters on the request");
    }
});

router.post('/clone', async function (req, res) {
    if (req.body.unit_code && req.body.unit_name) {
        let clone = await Units.clone(req.user_property.property_code, req.body.unit_code, req.body.unit_name);
       if(clone){
            res.successEnd('The selected unit has been cloned');
       }else{
            res.errorEnd("Failed! Unable to clone the selected unit. Please try again later!");
       }
        
    } else {
        res.errorEnd("Failed! Invalid or missing parameters on the request");
    }
});


module.exports = router;