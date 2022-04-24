const express = require("express");
const router = express.Router();
const globals = require("../helpers/global.params");
const app_helper = require("../helpers/app.helpers");
const fs = require("fs");
const path = require("path");


router.all('*', app_helper.checkAgency, function(req, res, next) {next();});

fs.readdirSync(path.join(globals.basedir, 'app','routes', 'agent')).forEach(function (route) {
    route = route.split('.')[0];
    router.use(`/${route}`, require(`./agent/${route}`));    
});

module.exports = router;