const express = require("express");
const router = express.Router();
const user = require("../models/users").User;
const property = require("../models/properties").Property;
const units = require("../models/units").Units;
var sanitizer = require('sanitizer');

const globals = require("../helpers/global.params");
const path = require("path");

router.get("/users/profile-image/:id", async function (req, res, next) {
    let profile = await new user(req.params.id);
    if(profile.user_code){
        if (profile.first_name === null || profile.last_name === null || profile.first_name === "" || profile.last_name === "") {
            next();
        }else{
            var initials = profile.first_name.charAt(0).toUpperCase();
            res.endImage(profile.avatar_path, initials, profile.avatar_color);
        }
    }else{
        next();
    }   
});

router.get("/properties/display-picture/:id", async function (req, res, next) {
    let prop = await property.public(req.params.id);   
    if(prop.property_code){
        if (prop.property_name === null) {
            next();
        }else{          
            var initials = prop.property_name.substring(0, 1).toUpperCase();
            var filename = prop.image_path + ".jpg";           
            var fl = path.join(globals.private_dir, "properties", filename);          
            res.endImage(fl, initials, prop.default_color);
        }
    }else{
        next();
    }    
});

router.get("/properties/public-picture/:id", function (req, res, next) {   
    var fl = path.join(globals.private_dir, "properties", req.params.id + ".jpg");    
    res.endImage(fl);
});

router.get("/units/public-picture/:id", function (req, res, next) {
    var fl = path.join(globals.private_dir, "units", req.params.id + ".jpg");
    res.endImage(fl);   
});

router.get("/units/display-picture/:id", async function (req, res, next) {
    let un = await units.displayImage(req.params.id);  
    if(un.unit_name){
        if (un.unit_name) {
            var initials;
            if (un.unit_name.length <= 6) {
                initials = un.unit_name.toUpperCase();
            } else {
                initials = un.unit_name.substr(0, 5).toUpperCase();
            }
            var filename = un.image_id + ".jpg";
            var fl = path.join(globals.private_dir, "units", filename);
            res.endImage(fl, initials,  "#50A5F1");            
        }else{
           next();
        }
    }else{
        next();
    }   
});

router.post("/units/reviews", async (req, res)=>{
    if (req.body.unit_code && req.body.start) {
        let unit_reviews = await units.reviews(req.body.unit_code, req.body.start);
        res.successEndData(unit_reviews);
    } else {
        res.successEndData([]);
    }
});

router.post("/units/submit-review", async (req, res)=>{
    if (req.body.unit_code && req.body.user_comments) {
        if(req.body.user_comments.length > 10) {
            let user_code = null;
            if(req.session.logged_in) { 
                user_code = req.session.user_code;
            }
            if(req.body.anonymous_review){
                user_code = null;
            }
            let data = {
                unit_code: req.body.unit_code,
                user_rating: req.body.user_rating,
                user_comments:sanitizer.escape(req.body.user_comments),
                verified_tenant: req.body.vt||0,
                user_code:user_code
            };
            let ok = await units.newReview(data);
            if(ok){
                res.successEnd("Review has been submitted successfully!");
            }else{
                res.errorEnd('Unable to submit your review. Please try again later.');
            }  
        }else{
            res.errorEnd('Your comments must be at least 10 characters.');
        }
       
    } else {
        res.errorEnd('Please enter your comments!');
    }
});

module.exports = router;
