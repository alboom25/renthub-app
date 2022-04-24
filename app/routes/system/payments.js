const express = require("express");
const router = express.Router();
const payments = require("../../models/payments").Payments;

router.get("/", function (req, res) {
    res.renderEjs(req, "payments/all", {
        page_title: "My Payments",
        sub_header: "",        
    });
});

router.post("/", async function (req, res) {
    if (req.query.action) {
        if (req.query.action == "get-all") {
            let pms = await new payments();
            pms.where_data = 'user_code = "'+ req.session.user_code +'"';
            let data = await pms.all(req.body);
            res.json(data);            
        } else {
            res.errorEnd("Failed!. Invalid request");
        }
    } else {
        res.errorEnd("Failed!. Invalid request");
    }
});

module.exports = router;