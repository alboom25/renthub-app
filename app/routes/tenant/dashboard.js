const express = require("express");
const router = express.Router();
const Dashboard = require("../../models/tenants").Dashboard;

router.get('/', async function(req, res){
    //console.log(req)       
        let [d, f, g, h, i] = await Promise.all([
            Dashboard.data(req.user_profile.email_address),
            Dashboard.graph_data(req.user_profile.email_address),
            Dashboard.month_data(req.user_profile.email_address),
            Dashboard.year_data(req.user_profile.email_address),
            Dashboard.all_data(req.user_profile.email_address)           
        ]); 
        let month_names = f.map(function(e){return e.month_name});
        let bills = f.map(function(e){return e.bill_total});
        let payments = f.map(function(e){return e.paid_amount});
        res.renderEjs(req, "tenant-account/dashboard", {
        page_title: "Tenant Dashboard",
        sub_header: "Dashboard" ,
        dash_data: d,
        month_names:month_names,
        bills: bills,
        payments:payments,
        month_data: g,
        year_data: h,
        all_data: i
    });  
});

module.exports = router;