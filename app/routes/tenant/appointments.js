const express = require("express");
const router = express.Router();

router.get('/', async function(req, res){
    res.renderEjs(req, "tenant-account/appointments", {
     page_title: "Appointments",
     sub_header: "My Appointments"  
 });  
});

module.exports = router;