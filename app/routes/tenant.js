const express = require("express");
const router = express.Router();
const globals = require("../helpers/global.params");
const fs = require("fs");
const path = require("path");

fs.readdirSync(path.join(globals.basedir, 'app','routes', 'tenant')).forEach(function (route) {
    route = route.split('.')[0];
    router.use(`/${route}`, require(`./tenant/${route}`));    
});

module.exports = router;