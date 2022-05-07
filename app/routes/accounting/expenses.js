const express = require("express");
const router = express.Router();

const Expenses = require("../../models/properties").Expenses;
const Expense = require("../../models/properties").Expense;
const validation_helper = require("../../helpers/validation.helper");
const validator = require("../../libs/validator");
const helpers = require("../../helpers/assorted.helpers");
const moment = require("moment");

router.get('/:id?', async function(req, res, next) {         
    if(req.params.id){
        let expense_info = await new Expense(req.user_property.property_code, req.params.id);
        if(expense_info.created_by_id){
            let [payments, items] = await Promise.all([
                Expenses.payments(req.params.id),
                Expenses.items(req.params.id),
            ]);

            
            res.renderEjs(req, "accounting/expense-info", {
                page_title: "Expenses",
                sub_header: "Property Expenses", 
                expense_info:expense_info,   
                payments:payments,    
                items:items,          
                property: req.user_property        
            });
        }else{
            next();
        }
    }else{
        res.renderEjs(req, "accounting/expenses", {
            page_title: "Expenses",
            sub_header: "Property Expenses",                  
            property: req.user_property        
        });
    }
});


router.get('/payments', function(req, res) {
    res.renderEjs(req, "accounting/expense-payments", {
        page_title: "Expense Payments",
        sub_header: "Payments",                  
        property: req.user_property,
    });
});

router.post('/new', async function(req, res){  
    if(req.body.expense_title.length>3 && req.body.expense_description.length>5 && req.body.entries.length>0){                   
        var obj={                        
            expense_title: req.body.expense_title,
            expense_description: req.body.expense_description,
            unit_code: req.body.unit_code,
            supplier_code: req.body.supplier_code,
            created_on: moment().format(),
            created_by: req.session.user_code,
            property_code: req.user_property.property_code
        };
        let exp = await new Expense(req.user_property.property_code);
        Object.assign(exp, obj);
        let added = await exp.save(req.body.entries);
        if(added){
            res.successEnd("The expense has been added!");
        }else{
            res.errorEnd("Unable to add expense. Please try again later!")
        }
    }else{
        res.errorEnd("Please provide title, description and break down");
    }
});

router.post('/', async function(req, res){
    let loader = await new Expenses();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'"';
    let data = await loader.all(req.body);
    res.json(data); 
});

router.post('/cancel', async function(req, res){
    if(req.body.id){
        let cancelled = await Expenses.Cancel(req.body.id);
        if(cancelled){
            res.successEnd("The expense has been cancelled!");
        }else{
            res.errorEnd("Unable to cancel the expense. Please try again later!");
        }
    }else{
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/delete', async function(req, res) {
    if(req.body.id){
        let deleted =  await Expenses.Delete(req.body.id);
        if(deleted){
            res.successEnd("The expense has been deleted!");
        }else{
            res.errorEnd("Unable to delete the expense. Please try again later!");
        }
    }else{
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/info', async function (req, res){
    if(req.body.id){
        let expense_info = await new Expense(req.user_property.property_code, req.body.id);
        if(expense_info.created_by_id){
            res.successEnd(expense_info);
        }else{
            res.errorEnd("Unable to locate the expense. Please try again later!");
        }
    }else{
        res.errorEnd("Invalid or missing parameters");
    }
});

router.post('/add-payment', async function(req, res) {
    var validate = validator.Validate(req.body, validation_helper.addExpensePayment());
    if (validate.has_errors) {
       res.errorEnd(validate.validation_errors.join("<br>"));
    } else {
        let expense_info = await new Expense(req.user_property.property_code, req.body.expense_id);

        if(expense_info.created_by_id){
            var balance = expense_info.expense_amount - expense_info.paid_amount;
            if(req.body.payment_amount>balance){
                res.errorEnd("The balance remaining for this expense is only " + helpers.formatDecimal(balance));
            }else{
                var obj = {
                    expense_id: req.body.expense_id,
                    payment_method: req.body.payment_method,
                    payment_date: new Date(req.body.payment_date),
                    amount: req.body.payment_amount,
                    reference: req.body.reference || 'N/A',
                    added_by: req.session.user_code,
                    source_account: req.body.source_account,
                    transaction_charge: req.body.transaction_charge,
                };

                let added = await Expenses.addPayment(obj);

                if(added){
                    res.successEnd("The payment has been added");
                }else{
                    res.errorEnd("Unable to add expense payment! Please try again later."); 
                }
            }
        }else{
            res.errorEnd("Unable to locate the expense. Please try again later!");
        }                  
    }
});

module.exports = router;