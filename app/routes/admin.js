const express = require("express");
const router = express.Router();
const globals = require("../helpers/global.params");
const app_helper = require("../helpers/app.helpers");
const fs = require("fs");
const path = require("path");


router.all('*', function(req, res, next) {
	if(req.user_profile.is_landlord){
		next();
	}else{		
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	}   
});

fs.readdirSync(path.join(globals.basedir, 'app','routes', 'admin')).forEach(function (route) {
    route = route.split('.')[0];
    router.use(`/${route}`, app_helper.checkSubscriptions, require(`./admin/${route}`));    
});

module.exports = router;