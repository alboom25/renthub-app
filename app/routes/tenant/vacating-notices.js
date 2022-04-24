const express = require("express");
const router = express.Router();

router.get('/', async function(req, res){
    //let leases = await Tenants.getUnits(req.user_profile.email_address);
    res.renderEjs(req, "tenant-account/notices", {
        page_title: "Vacating Notices",
        sub_header: "Notices",            
        
    });  
});


module.exports = router;