const express = require("express");
const router = express.Router();
const moment = require("moment");

const Works = require('../../models/properties').Works;
const Expense = require("../../models/properties").Expense;

const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");

router.get('/', function (req, res) {
    res.renderEjs(req, "work-orders/all-works", {
        page_title: "Work Orders",
        sub_header: "Work Orders",
        property: req.user_property        
    });
});

router.post("/", async function (req, res) {
    let loader = await new Works();                
    loader.where_data = 'property_code = "'+ req.session.property_code +'"';
    let data = await loader.all(req.body);    
    res.json(data);
});

router.post("/new", async function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.newAdminWorkOrder());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var obj ={
            date_posted:moment().format(),
            description: req.body.description,
            unit_code: req.body.unit_code,
            work_origin: "Internal",
            work_type: req.body.work_type,
            status:"Pending",
            priority: req.body.priority,
            supplier_code: req.body.supplier_code          
        };
        let added = await Works.Add(obj);
        if(added){
            res.successEnd("The new work order has been added.");
        }else{
            res.errorEnd("Unable to add a new work order. Please try again later.");
        }      
    }
});

router.post("/update", async function (req, res) {
    var validate = validator.Validate(req.body, validation_helper.newAdminWorkOrder());
    if (validate.has_errors) {
        res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        var obj ={            
            description: req.body.description,
            unit_code: req.body.unit_code,   
            work_type: req.body.work_type,     
            priority: req.body.priority,
            supplier_code: req.body.supplier_code      
        };
        let updated = await Works.Update(obj, req.body.work_id);

        if(updated){
            res.successEnd("The work order details have been updated.");
        }else{
            res.errorEnd("Unable to update work order details! Please try again later.");
        }    
    }
});

router.post("/update-progress", async function (req, res) {
    var obj ={            
        description: req.body.description,           
        work_id: req.body.work_id,     
        activity_date: req.body.activity_date           
    };
    let added = await Works.updateProgress(obj, req.body.work_id);

    if(added){
        //insert tenant notifications
        res.successEnd("The work order progress has been updated.");       
        if (req.body.work_completed=='1'){
            obj ={completed: 1, status: 'Completed'};   
            //send sms notification to tenant        
        }else{
            obj ={status: 'In Progress'};  
        }
        await Works.Update(obj, req.body.work_id);
    }else{
        res.errorEnd("Unable to update work order progress! Please try again later.");
    }    
});

router.post("/approve", async function (req, res) {
    if(req.body.work_id){        
        let obj ={status: 'Pending'};
        let approved = await Works.Update(obj, req.body.work_id);
        if(approved){
            res.successEnd("The work order progress has been approved.");       
        }else{
            res.errorEnd("Unable to approve work order! Please try again later.");
        }
    }else{
        res.errorEnd("Unable to approve work order! Please try again later.");
    }    
});

router.post("/info", async function (req, res, next) { 
    if(req.body.id){
        let work_info = await Works.Get(req.body.id) 
        if(work_info)  {
            res.successEnd(work_info);
        }else{
            res.errorEnd("Unable to get details for the selected work order!");
        }
    }else{
      next();
    }
});

router.post("/generate-bill", async function (req, res, next) { 
    if(req.body.id){
        let work = await Works.Get(req.body.id) 
        if(work) {           
            if(!work.completed){
                return res.errorEnd("Cannot generate a bill for an incomplete work order!");
            }
            if(work.bill_generated){
                return res.errorEnd("A bill for the selected work order has already been generated!");
            }
            if(!req.body.entries){
                return res.errorEnd("No entries given for the selected work order!");
            }

            if(req.body.entries.length == 0){
                return res.errorEnd("No entries given for the selected work order!");
            }
            let b = {
                expense_title: 'Room/Unit Works - '+ work.work_type,
                unit_code: work.unit_code,
                supplier_code: work.supplier_code,
                expense_description: work.description,
                created_on: moment().format(),
                created_by: req.session.user_code,
                property_code: req.user_property.property_code
            };   

            let exp = await new Expense(req.user_property.property_code);
            Object.assign(exp, b);
            
            let added = await Works.generate_bill(req.body.id, exp, req.body.entries);
            if(added){
                res.successEnd("The bill has has been generated!");
            }else{
                res.errorEnd("Unable to generate the bill. Please try again later!")
            }

        }else{
            res.errorEnd("Unable to get details for the work order. Please refresh the window and try again!");
        }
    }else{
      next();
    }
});



module.exports = router;