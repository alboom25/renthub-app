const express = require("express");
const router = express.Router();
const Suppliers = require("../models/suppliers").Suppliers;
const Invoices = require("../models/suppliers").Invoices;
const ExpensesPayments = require("../models/suppliers").ExpensesPayments;
const Property = require("../models/properties").Property;


const validator = require("../libs/validator");
const validation_helper = require("../helpers/validation.helper");

const app_helper = require("../helpers/app.helpers");
const helpers = require("../helpers/assorted.helpers");

const uuid = require("uuid");

router.all('*', app_helper.checkSubscriptions, app_helper.checkProperty, function (req, res, next) {
	next();
});

router.get("/all", function (req, res) {
	res.renderEjs(req, "suppliers/all-suppliers", {
		page_title: "Suppliers",
		sub_header: "Suppliers",
	});
});

router.get("/detailed/:id", async function (req, res, next) {
	if(req.params.id){
		let supp = await Suppliers.info(req.params.id, req.session.user_code);		
		if(supp){
			let prop = await new Property(req.session.user_code, req.session.property_code);
			res.renderEjs(req, "suppliers/detailed", {
				page_title: "Supplier Details",
				sub_header: "Supplier Details",
				supplier:supp,
				property: prop
			});
		}else{
			next();
		}		
	}else{
		next();
	}	
});

router.get("/invoices", async function (req, res) {
	let prop = await new Property(req.session.user_code, req.session.property_code);
	prop.accounts_list =  JSON.parse(prop.accounts_list);
	res.renderEjs(req, "accounting/supplier-invoices", {
		page_title: "Supplier Invoices",
		sub_header: "Supplier Invoices",
		property: prop
	});
});

router.get("/payments", async function (req, res) {
	let prop = await new Property(req.session.user_code, req.session.property_code);
	prop.accounts_list =  JSON.parse(prop.accounts_list);
	res.renderEjs(req, "accounting/supplier-payments", {
		page_title: "Supplier Payments",
		sub_header: "Supplier Payments",
		property: prop
	});
});

router.post("/all", async function (req, res) {
	let loader = await new Suppliers();
	loader.where_data = 'user_code = "' + req.session.user_code + '"';
	let data = await loader.all(req.body);
	res.json(data);
});

router.post("/list", async(req, res) => {
	let list = await Suppliers.getList(req.session.user_code);
	res.successEnd(list);
});

router.post("/delete", async function (req, res, next) {
	if (req.body.id) {
		let deleted = await Suppliers.Delete(req.body.id);
		if (deleted) {
			res.successEnd("The selected supplier has been deleted.");
		} else {
			res.errorEnd("Unable to delete the selected supplier!");
		}
	} else {
		next();
	}
});

router.get("/exists", async function (req, res) {
	if (req.query.email_address) {
		var email = decodeURIComponent(req.query.email_address);
		let result = await Suppliers.emailRegistered(email);
		res.json(result);
	} else {
		next();
	}
});

router.post("/new", async function (req, res) {
	var validate = validator.Validate(req.body, validation_helper.addNewSupplier());
	if (validate.has_errors) {
		res.errorEnd(validate.validation_errors.join("<br>"));
	} else {
		let result = await Suppliers.emailRegistered(req.body.email_address);
		if (result == "false") {
			res.errorEnd("A supplier with the provided email already exists!");
		} else {
			var obj = {
				supplier_code: uuid.v4(),
				first_name: helpers.titleCase(req.body.first_name),
				last_name: helpers.titleCase(req.body.last_name),
				email_address: req.body.email_address,
				phone_number: req.body.phone_number,
				user_code: req.session.user_code,
				supplier_type: req.body.supplier_type
			};
			let added = await Suppliers.add(obj);
			if (added) {
				res.successEnd("The new supplier has been added.");
			} else {
				res.errorEnd("Unable to add a new supplier. Please try again later.");
			}
		}
	}
});

router.post("/update", async function (req, res) {
	var validate = validator.Validate(req.body, validation_helper.addNewSupplier());
	if (validate.has_errors) {
		res.errorEnd(validate.validation_errors.join("<br>"));
	} else {
		let result = await Suppliers.emailAssigned(req.body.email_address, req.body.supplier_code);
		if (result) {
			res.errorEnd("A supplier with the provided email already exists!");
		} else {
			var obj = {
				first_name: helpers.titleCase(req.body.first_name),
				last_name: helpers.titleCase(req.body.last_name),
				email_address: req.body.email_address,
				phone_number: req.body.phone_number,
				user_code: req.session.user_code,
				supplier_type: req.body.supplier_type
			};
			let added = await Suppliers.Update(obj, req.body.supplier_code);
			if (added) {
				res.successEnd("The supplier details have been updated.");
			} else {
				res.errorEnd("Unable to update supplier details! Please try again later.");
			}
		}
	}
});

router.post("/info", async function (req, res, next) {
	if (req.body.id) {
		let supplier_info = await Suppliers.Get(req.body.id)
		if (supplier_info) {
			res.successEnd(supplier_info);
		} else {
			res.errorEnd("Unable to get details for the selected supplier!");
		}
	} else {
		next();
	}
});

router.post('/invoices', async function (req, res) {
	let loader = await new Invoices();
	loader.where_data = 'property_code = "' + req.session.property_code + '"';
	let data = await loader.all(req.body);
	res.json(data);
});

router.post('/payments', async function (req, res) {
	let loader = await new ExpensesPayments();
	loader.where_data = 'property_code = "' + req.session.property_code + '"';
	let data = await loader.all(req.body);
	res.json(data);
});

module.exports = router;