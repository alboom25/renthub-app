const express = require("express");
const router = express.Router();

router.get('/', async function(req, res){
    res.renderEjs(req, "tenant-account/favourites", {
     page_title: "Favourite Units",
     sub_header: "Favourites"  
 });  
});

module.exports = router;