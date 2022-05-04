const express = require("express");
const router = express.Router();
const dashboard = require("../../models/dashboard").Admin;
const app_helper = require("../../helpers/app.helpers");

router.use("*", app_helper.checkProperty);

router.get('/', async function(req, res){
    let [numbers_data, best_units, revenues, units_info] = await Promise.all([
        dashboard.getNumbers(req.session.user_code),
        dashboard.bestUnits(req.session.user_code),
        dashboard.revenueGraph(req.session.user_code),
        dashboard.unitsData(req.session.user_code)
    ]); 

    var units_data=[];
    var units_labels =[];

    for (var i = 0; i <units_info.length; i++) {
        units_data.push(units_info[i].leased_units);
        units_labels.push(units_info[i].unit_type);
    }

    var revenue_data=[];
    var revenue_categories = [];
    for (var i = 0; i <revenues.length; i++) {
        revenue_data.push(revenues[i].revenue);
        revenue_categories.push(revenues[i].month_name);
    }
    
    res.renderEjs(req, "dashboard", {
        page_title: "Analytics",
        sub_header: "Dashboard",   
        numbers_data:numbers_data,
        revenue_categories:revenue_categories.join(","),
        revenue_data:revenue_data.join(","),
        units_data:units_data.join(","),
        units_labels:units_labels.join(","),
        best_units:best_units,
    });   
});


module.exports = router;