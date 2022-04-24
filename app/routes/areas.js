const express = require("express");
const router = express.Router();
const locations = require("../models/locations").Locations;

router.post('/', async function(req,res){
    if(req.body.county_id) {
        let constituencies = await locations.constituencies(req.body.county_id);
        res.successEndData(constituencies);
    } else {
        res.errorEnd("Invalid/Missing parameters!");
    }
});

router.post('/localities', async function(req,res){
    if(req.body.area_id) {
        let locals = await locations.localities(req.body.area_id);
        res.successEndData(locals);
    } else {
        res.errorEnd("Invalid/Missing parameters!");
    }
});

router.post('/counties', async function(req,res){
    let counties = await locations.counties();
    res.successEndData(counties);
});



module.exports = router;