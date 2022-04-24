const express = require("express");
const router = express.Router();

router.get('/', async function(req, res){
       res.renderEjs(req, "tenant-account/work-orders", {
        page_title: "Work Orders",
        sub_header: "Work Orders"  
    });  
});


module.exports = router;