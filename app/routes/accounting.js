const express = require("express");
const router = express.Router();
const props = require("../models/properties").Properties;
const globals = require("../helpers/global.params");
const app_helper = require("../helpers/app.helpers");
const fs = require("fs");
const path = require("path");



router.all('*', app_helper.checkSubscriptions, function(req, res, next) {next();});

router.get('/working-property', async function(req, res){
    let ps = await props.getBriefAll(req.session.user_code);
    let msg = '/admin/dashboard';
    if(req.query.dest){
        msg = Buffer.from(req.query.dest, "base64").toString();
    }    
    res.renderEjs(req, "manage/working-property", {
        page_title: "Choose Property",   
        sub_header: "Choose a property to proceed",
        property_list: ps,
        dest: msg
    });
});

router.post('/working-property', async function(req, res){
    if(req.body.property_code){
        req.session.property_code = req.body.property_code;
        res.successEnd("Working property set");
    }else{
        res.errorEnd("Property not selected. Please try again!"); 
    }
});

router.use("*", app_helper.checkProperty);

fs.readdirSync(path.join(globals.basedir, 'app','routes', 'accounting')).forEach(function (route) {
    route = route.split('.')[0];
    router.use(`/${route}`, require(`./accounting/${route}`));    
});

module.exports = router;