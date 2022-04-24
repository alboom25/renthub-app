const moment = require("moment");
const Users = require("../models/users").Users;
const props = require("../models/properties").Properties;
const Property = require("../models/properties").Property;

module.exports.checkSubscriptions = async function (req, res, next) {
    if(req.user_profile.is_landlord){       
        let subscription = await Users.userSubscription(req.session.user_code);
        if(subscription) {
            var a = moment(subscription.expiry_date);
            var b = moment(moment().format());
            var diff_days = b.diff(a, "days");
            if(diff_days > 0) {
                if(req.method === "GET") {
                    res.redirect(`//${req.__base_domain}/system/subscriptions/new`);;	
                } else {
                    res.errorEnd("Your subscription has expired. Please renew and try again!");
                }
            } else {
                next();
            }
        } else {
            if(req.method === "GET") {
                res.redirect(`//${req.__base_domain}/system/subscriptions/new`);;	
            } else {
                res.errorEnd("Your subscription has expired. Please renew and try again!");
            }
        }
    }else{       
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    } 	
}

module.exports.checkProperty = async function(req, res, next) { 
    if(req.session.property_code){
        let prop = await new Property(req.session.user_code, req.session.property_code);       
        prop.readable_meters = JSON.parse(prop.readable_meters); 
        prop.accounts_list = JSON.parse(prop.accounts_list);      
        req.user_property = prop;
        next();
    }else{
        //check how many properties does the user have
        let cnt = await props.userPropertyCount(req.session.user_code);  
        if(cnt==0){   
            res.renderEjs(req, "props/no-props", {
                page_title: "My Properties",
                sub_header: "Add property"               
            });
        }else if(cnt>1){
            if(req.method =='GET'){
                var dest = Buffer.from(req.originalUrl).toString("base64");              
                res.redirect("/manage/working-property?target="+dest);
            }else{
                res.errorEnd("Working property not selected. Please choose a property and try again!");
            }
        }else{
            let prop = await props.getBriefAll(req.session.user_code);
           // prop.readable_meters = JSON.parse(prop.readable_meters);    
            //prop.accounts_list = JSON.parse(prop.accounts_list);             
            req.user_property = prop;
            req.session.property_code =prop[0].property_code;
            next();
        }       
    }  
}

module.exports.checkAgency = async function(req, res, next) {  
    let is_agent = await Users.isAgent(req.user_profile.email_address);
    if(is_agent){
        next();
    }else{
        if(req.method =='GET'){
            res.renderEjs(req, "agent/no-property", {
                page_title: "No Property",   
                sub_header: "No active property assigned",              
            });
        }else{
            res.errorEnd("No property found. You are not assigned any property currently!");
        }
    }  
}