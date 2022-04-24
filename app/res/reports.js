const express = require("express");
const router = express.Router();

const globals = require("../helpers/global.params");

router.get("/", function (req, res) {
    res.renderEjs(req, "reports/home", {
        page_title: "Reports",     
        
        
        sub_header: "Reports",
        
    });
});

module.exports = router;