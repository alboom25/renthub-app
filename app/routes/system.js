const express = require("express");
const router = express.Router();
const props = require("../models/properties").Properties;
const Property = require("../models/properties").Property;
const Users = require("../models/users").Users;
const globals = require("../helpers/global.params");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

router.all('*', function(req, res, next) {
     if(req.user_profile.is_landlord){        
          next();
     }else{
          var err = new Error('Not Found');
          err.status = 404;
          next(err);
     }   
});

fs.readdirSync(path.join(globals.basedir, 'app','routes', 'system')).forEach(function (route) {
    route = route.split('.')[0];
    router.use(`/${route}`, require(`./system/${route}`));    
});

module.exports = router;