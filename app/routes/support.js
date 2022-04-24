
const express = require("express");
const router = express.Router();

router.get("/help", function(req, res){    
    res.renderEjs(req, "support/help", {
		page_title: "Support",
		sub_header: "Get Help"	
	});
});

router.get("/contacts", function(req, res){    
    res.renderEjs(req, "support/contact", {
		page_title: "Support",
		sub_header: "Contact Us"	
	});
});

module.exports = router;