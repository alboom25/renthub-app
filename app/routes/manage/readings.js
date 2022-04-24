const express = require("express");
const router = express.Router();

const Readings = require("../../models/properties").Readings;
const LastReadings = require("../../models/properties").LastReadings;
const helpers = require("../../helpers/assorted.helpers");

const readings_helper = require("../../helpers/readings.insert");

router.get("/", function(req, res){    
    res.renderEjs(req, "props/meters", {
        page_title: "Manage Property",
        sub_header: "Meter Readings",                  
        property: req.user_property,
    });
});

router.post("/", async function(req, res){
    let loader = await new LastReadings();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'"';
    let data = await loader.all(req.body);
    res.json(data);      
});

router.post("/last-readings", async function(req, res){
    let loader = await new LastReadings();
    loader.where_data = 'property_code = "'+ req.user_property.property_code +'" AND reading_type = "'+req.body.meter_name +'"';
    let ldata = await loader.all(req.body);  
    res.json(ldata);
});

router.post("/submit-readings", function(req, res){
    if(req.body.meter_name && req.body.readings_date && req.body.readings){
        if(req.body.readings.length===0){
            res.errorEnd("No meter readings to submit");
        }else{
            if(new Date(req.body.readings_date) > new Date(helpers.todaysDate())){
                res.errorEnd("Readings date cannot be greater than today");
            }else{                          
                res.successEnd("Meter readings have been submitted and will be updated shortly");
                var rds = req.body.readings;
                for(var i=0; i < rds.length; i++){
                    const arr = req.user_property.readable_meters;
                    const mobj =  arr.filter(result=>result['Meter Name']==req.body.meter_name).map(ele=>ele);
                   
                   if(mobj.length==1){                                 
                        readings_helper.registerReading(rds[i], mobj, req.session.user_code, req.body.readings_date, req.user_property, (added)=>{});
                    ////readings_helper
                   }
                }                           
            }
        }
    }else{
        res.errorEnd("Invalid data. Speficy Meter, Readings date and provide the readings");
    }
});

router.post("/unit-readings", async function(req, res){
    let rs = await Readings.lastSingle(req.body.unit_code);
    var meters = req.user_property.readable_meters;
        
    var out_meters = [];
    if(meters){
        for (var i = 0; i < meters.length; i++) {
        
            var ob_name = meters[i]["Meter Name"];
            var ob_value = 0;
            for (var j = 0; j < rs.length; j++){
                if(rs[j].reading_type == meters[i]["Meter Name"]){
                    var mv = parseFloat(rs[j].read_value) || 0;               
                    ob_value = mv;                               
                    break;
                }                           
            }
            var obj = {reading_type: ob_name, read_value: ob_value};
            out_meters.push(obj);
        }  
    }
                    
    res.successEnd(out_meters);
});

module.exports = router;