const express = require("express");
const router = express.Router();
const path = require("path");
const uuid = require("uuid");

const locations = require("../../models/locations").Locations;
const Properties = require("../../models/properties").Properties;
const property = require("../../models/properties").Property;
const AccountsList = require("../../models/properties").AccountsList;
const Readings = require("../../models/properties").Readings;
const Users = require("../../models/users").Users;

const file_helpers = require("../../helpers/file.helpers");
const validation_helper = require("../../helpers/validation.helper");
const validator = require("../../libs/validator");
const globals = require("../../helpers/global.params");

router.get("/", async function(req, res) {
	let [subscription, user_properties] = await Promise.all([
		Users.userSubscription(req.session.user_code),
		Properties.getBriefAll(req.session.user_code)
	]);
	
	res.renderEjs(req, "props/all", {
		page_title: "My Properties",
		sub_header: "All Properties",
		max_properties: subscription.maximum_properties,
		props: user_properties,
	});
});

router.get('/:id/settings', async function(req, res, next) {   
    let user_property = await new property(req.session.user_code, req.params.id);	

    if(user_property.property_code) {
		user_property.readable_meters = JSON.parse(user_property.readable_meters);		
		let [images, counties, accounts_list] = await Promise.all([
			user_property.images(),
			await locations.counties(),
			AccountsList.list(req.session.user_code)
		]);

		var image_paths = [];
		for (var i = 0; i < images.length; i++) {
			image_paths.push(images[i]);
		}       
        res.renderEjs(req, "props/settings", {            
            page_title: "Manage Property",
            sub_header: "Property Settings",            
            counties: counties,
            property: user_property,
			property_images: image_paths,
			accounts_list:accounts_list
        });
    }else{
        next();
    }
});

router.get("/new", async function(req, res) {

	let [subscription, available_Properties] = await Promise.all([
		Users.userSubscription(req.session.user_code),
		Properties.getBriefAll(req.session.user_code)
	]);

	if(subscription.maximum_properties > available_Properties.length) {
		let [counties, accounts_list] = await Promise.all([
			await locations.counties(),
			AccountsList.list(req.session.user_code)
		]);
			res.renderEjs(req, "props/new", {
			page_title: "New Property",
			sub_header: "Add new Property",
			max_properties: subscription.maximum_properties,
			counties: counties,
			accounts_list:accounts_list
		});
	} else {
		res.renderEjs(req, "props/max-props", {
			page_title: "My Properties",
			sub_header: "Add property",
			max_properties: subscription.maximum_properties,
		});
	}
});

router.post("/new", async function(req, res) {
	let subscription = await Users.userSubscription(req.session.user_code);
		let available_Properties = await Properties.getBriefAll(req.session.user_code);
		if(subscription.maximum_properties > available_Properties.length) {
			var validate = validator.Validate(req.body, validation_helper.newProperty());
			if(validate.has_errors) {
				res.errorEnd(validate.validation_errors.join("<br>"));
			} else {
				var has_cctv = 0 || req.body.has_cctv == "1";
				var pet_friendly = 0 || req.body.pet_friendly == "1";
				var has_garden = 0 || req.body.has_garden == "1";
				var has_parking = 0 || req.body.has_parking == "1";
				var has_swimming_pool = 0 || req.body.has_swimming_pool == "1";
				var has_generator = 0 || req.body.has_generator == "1";
				var gated_community = 0 || req.body.gated_community == "1";
				
				var has_lift = 0 || req.body.has_lift == "1";
				var obj = {
					property_name: req.body.property_name.toUpperCase(),
					locality_id: req.body.locality_code,
					property_description: req.body.property_description,
					property_type: req.body.property_type,
					unit_types: req.body.unit_types,
					year_built: req.body.year_built,
					street_address: req.body.street_address,
					floors: req.body.floors,
					has_cctv: has_cctv,
					pet_friendly: pet_friendly,
					has_garden: has_garden,
					has_parking: has_parking,
					has_swimming_pool: has_swimming_pool,
					has_lift: has_lift,
					has_generator: has_generator,
					gated_community:gated_community,
					longitude: req.body.longitude,
					latitude: req.body.latitude,
					property_accounts: req.body.property_accounts,
					property_value: parseFloat(req.body.property_value),
				};
				let prop = await new property(req.session.user_code);
				Object.assign(prop, obj);
				let prop_created = await prop.save();
				if(prop_created) {
					res.successEnd(req.__base_url + "/properties/" + prop.property_code.toString());
				} else {
					res.errorEnd("Failed! Unable to create property. Please try again later.");
				}
			}
		} else {
			res.errorEnd("Cannot add more properties! Please upgrade your package.");
		}
});

router.post("/delete", async function(req, res) {
	if(req.body.id) {
		let prop = await new property(req.session.user_code, req.body.id);
		if(prop.property_code) {
			let images = await prop.images();
			let deleted = await prop.delete();
			if(deleted) {
				res.successEnd("The property has been deleted");
				images = images || [];
				for(var i = 0; i < images.length; i++) {
					var filename = images[i].image_id + ".jpg";
					var fl = path.join(globals.private_dir, "properties", filename);
					file_helpers.delete_file(fl);
				}
			} else {
				res.errorEnd("Unable to delete the property. Make sure the property has no associated units or tenants");
			}
		} else {
			res.errorEnd("Invalid or missing property!");
		}
	} else {
		res.errorEnd("Invalid or missing parameters");
	}
});

router.post('/:id/*', async function(req, res, next) { 
	let user_property = await new property(req.session.user_code, req.params.id);
	if(user_property.property_code) {
		req.property  = user_property;
		next();
	}else{
		res.errorEnd("The property is invalid or has been removed from the system!");
	}
});

router.post('/:id/settings', async function(req, res) {   
	let user_property = req.property;
	var validate = validator.Validate(req.body, validation_helper.newProperty());
	if (validate.has_errors) {
		res.errorEnd(validate.validation_errors.join("<br>"));
	} else {
		var has_cctv = 0 || req.body.has_cctv == "1";
		var pet_friendly = 0 || req.body.pet_friendly == "1";
		var has_garden = 0 || req.body.has_garden == "1";
		var has_parking = 0 || req.body.has_parking == "1";
		var has_swimming_pool = 0 || req.body.has_swimming_pool == "1";
		var has_generator = 0 || req.body.has_generator == "1";
		var gated_community = 0 || req.body.gated_community == "1";
		var has_lift = 0 || req.body.has_lift == "1";

		var is_active = 0 || req.body.is_active == "1";
		var email_notifications = 0 || req.body.email_notifications == "1";
		var sms_notifications = 0 || req.body.sms_notifications == "1";

		var obj = {
			property_name: req.body.property_name.toUpperCase(),
			locality_id: req.body.locality_code,
			property_description: req.body.property_description,
			property_type: req.body.property_type,
			unit_types: req.body.unit_types,
			year_built: req.body.year_built,
			street_address: req.body.street_address,
			floors: req.body.floors,
			has_cctv: has_cctv,
			pet_friendly: pet_friendly,
			has_garden: has_garden,
			has_parking: has_parking,
			has_generator:has_generator,
			gated_community:gated_community,
			has_swimming_pool: has_swimming_pool,
			has_lift:has_lift,
			sms_notifications: sms_notifications,
			email_notifications: email_notifications,
			is_active: is_active,
			address: req.body.address,		
			readable_meters: req.body.readable_meters,
			property_accounts: req.body.property_accounts,
			property_value: parseFloat(req.body.property_value)
		};                 

		let updated = await user_property.update(obj);
		if (updated) {
			res.successEnd("Property settings have been updated");
			let m = JSON.parse(req.body.readable_meters);
			for (let i = 0; i < m.length; i++) {
				await Readings.intitializeMeter(m[i]['Meter Name'], req.session.user_code, m[i]['Rate'],user_property.property_code );
			}
		} else {
			res.errorEnd("Failed! Unable to update property settings. Please try again later.");
		}
	}
});

router.post('/:id/upload-image', async function(req, res) {
	let user_property = req.property;
	let images = await user_property.images();              
		if (images.length < 7) {
			if (req.body.image_data) {
				var data = Buffer.from(req.body.image_data, "base64");
				var file_id = uuid.v4();
				var filename = file_id + ".jpg";
				var fl = path.join(globals.private_dir, "properties", filename);
				let created = await file_helpers.createFile(data, fl);

				if (created) {
					var image_info = {
						image_id: file_id,
						property_code: user_property.property_code,
						image_description: req.body.description,
					};

					let updated = await Properties.addImage(image_info);
					if (updated) {
						res.successEnd("A new property image has been uploaded");
					} else {
						file_helpers.delete_file(fl);
						res.errorEnd("Unable to add a new image. Please try again later");
					}
				} else {
					res.errorEnd("Unable to add property image");
				}
			} else {
				res.errorEnd("Invalid or missing image");
			}
		} else {
			res.errorEnd("You have attained a maximum number of pictures for this property");
		}
	
});

router.post('/:id/delete-image', async function(req, res) {	
	if (req.body.image_id) {
		let deleted = await Properties.deleteImage(req.body.image_id);
		if (deleted) {
			res.successEnd("The picture has been deleted");
			var filename = req.body.image_id + ".jpg";
			var fl = path.join(globals.private_dir, "properties", filename);
			file_helpers.delete_file(fl);
		} else {
			res.errorEnd("Unable to delete picture. Invalid or missing parameters");
		}
	} else {
		res.errorEnd("Invalid or missing parameters");
	}
});

router.post('/:id/set-display-picture', async function(req, res) {
	let user_property = req.property;
	if (req.body.image_data) {
		if (user_property.image_path === null) {
			let updated = await Properties.uploadImage(req.body.image_data,  user_property.property_code);
			if (updated) {
                res.successEnd("A new display picture has been set");
            } else {               
                res.errorEnd("Unable to set display picture. Please try again later");
            }
		} else {
			let deleted = await Properties.deleteImage(user_property.image_path);
			if (deleted) {
				var filename = user_property.image_path + ".jpg";
				var fl = path.join(globals.private_dir, "properties", filename);
				file_helpers.delete_file(fl);
				let updated = await Properties.uploadImage(req.body.image_data, user_property.property_code);
				if (updated) {
					res.successEnd("A new display picture has been set");
				} else {               
					res.errorEnd("Unable to set display picture. Please try again later");
				}
			} else {
				res.errorEnd("Unable to set display picture. Please try again later");
			}                        
		}
	} else {
		res.errorEnd("Invalid or missing image");
	}
});

router.post('/list', async function(req, res) {
	let list = await Properties.list(req.session.user_code);
	res.successEnd(list);
});

router.post('/name', async function(req, res) {
	let nm = await Properties.name(req.body.code);
	res.successEnd(nm);
});

module.exports = router;