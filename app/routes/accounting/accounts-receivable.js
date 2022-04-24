const express = require("express");
const router = express.Router();

const Bills = require("../../models/tenants").Bills;

router.get('/', async function(req, res) {   
    res.renderEjs(req, "accounting/accounts-receivable", {
        page_title: "Accounts Receivables",
        sub_header: "Expected Incomes",                  
        property: req.user_property      
    });
});

router.post('/', async function(req, res){
    let loader = await new Bills();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND (total_amount - paid_amount) > 0';
    let data = await loader.all(req.body);  
    res.json(data); 
});

router.post('/total', async function(req, res){
    let total = await Bills.unpaidTotal(req.user_property.property_code);
    res.successEnd(total)
});

module.exports = router;