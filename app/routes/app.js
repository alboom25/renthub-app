const express = require("express");
const router = express.Router();
const User = require("../models/users").User;
const Users = require("../models/users").Users;
const globals = require("../helpers/global.params");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const avoid = ['public', 'app', 'pesa'];

fs.readdirSync(path.join(globals.basedir, 'app','routes')).forEach(function (route) {
    var pt = path.join(globals.basedir, 'app','routes', route);   
    var stats = fs.statSync(pt);
    if(stats.isFile()){
        route = route.split('.')[0];
        if (avoid.includes(route)) {
            return;
        }
        router.use(`/${route}`, authenticate, require(`./${route}`));
    }
});

router.get("/", authenticate, function(req, res){    
    if(req.user_profile.is_landlord){
        res.redirect('/admin/dashboard');
    }else if(req.user_profile.is_tenant){
        res.redirect('/tenant/dashboard');
    }else if(req.user_profile.is_agent){
        res.redirect('/agent/properties');
    }else{
        res.renderEjs(req, "home", {
            page_title: "Welcome",
            sub_header: "Welcome",
        });
    }
});

async function authenticate(req, res, next) { 
    if(req.session.logged_in) { 
        if(req._parsedOriginalUrl.path=='/user/logout'){          
            req.session.destroy();
            res.redirect("/auth/login");
        }else if(req._parsedOriginalUrl.pathname.includes('/auth/unlock-session')){
            if(req.body.userpassword){
                let profile = await new User(req.session.user_code);        
                bcrypt.compare(req.body.userpassword, profile.password).then((is_match) => {
                    if (is_match) {
                        req.session.user_locked = false;
                        res.successEnd("Session unlocked");
                    } else {                  
                        res.errorEnd("Your password is not correct");
                    }
                });
            }else{
                res.errorEnd("Please provide your password to unlock");
            }
        }else{
            let [profile, has_prop] = await Promise.all([
                new User(req.session.user_code),
                Users.hasProperties(req.session.user_code)
            ]);
           
            profile.has_properties = has_prop;
            if(profile.user_code) {
                if(profile.first_name === null || profile.first_name === "" || profile.last_name === null || profile.last_name === "") {
                    if(req.method === "GET") {
                        res.renderEjs(req, "user/account-brief", {
                            page_title: "Profile Settings",
                        });
                    } else {                     
                        if(req._parsedOriginalUrl.pathname == "/user/profile") {
                            next();
                        } else {
                            res.errorEnd("Account setup not complete!");
                        }
                    }
                } else {
                    req.user_profile = profile;
                    if(req.session.user_locked) {
                        if(req.method === "GET") {
                            res.renderEjs(req, "user/locked", {
                                page_title: "Locked",
                                sub_header: "Locked",
                            });
                        } else {
							if(req.path.includes('unlock-session')){
								next();
							}else{
								res.errorEnd("User session is locked. Please unlock first");
							}                            
                        }
                    } else {
                        next();
                    }
                }
            } else {
                req.session.destroy();
                if(req.method === "GET") {
                    var dest = Buffer.from(req.originalUrl).toString("base64");
                    res.redirect("/auth/login?r=" + dest);
                } else {
                    res.errorEnd("Your session has expired. Please refresh and log in first!");
                }
            }
        }
		
	} else {          
        if(req._parsedOriginalUrl.pathname.includes('/auth/')) {           
            next();
        }else{
            if(req.method === "GET") {
                if(req.xhr) {
                    res.renderEjs(req, "errors/expired");
                } else {                  
                    var dest = Buffer.from(req.originalUrl).toString("base64");
                    res.redirect("/auth/login?r=" + dest);
                }
            } else {
                res.errorEnd("Your session has expired. Please refresh and log in first!");
            }
        }		
	}
}

module.exports = router;