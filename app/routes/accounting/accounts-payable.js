const express = require("express");
const router = express.Router();

const Payables = require("../../models/properties").Payables;

router.get('/', async function(req, res) { 
    res.renderEjs(req, "accounting/accounts-payable", {
        page_title: "Accounts Payables",
        sub_header: "Expected Payables",                  
        property: req.user_property       
    });
});

router.post('/', async function(req, res){
    let loader = await new Payables();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" ';
    let data = await loader.all(req.body);  
    res.json(data); 
});

router.post('/total', async function(req, res){
    let total = await Payables.unpaidTotal(req.user_property.property_code);
    res.successEnd(total)
});

module.exports = router;