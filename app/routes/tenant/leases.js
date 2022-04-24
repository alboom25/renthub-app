const express = require("express");
const router = express.Router();

const Tenants = require("../../models/tenants").Tenants;
const units = require("../../models/units").Units;
const Lease = require("../../models/units").Lease;
const Readings = require("../../models/properties").Readings;
const helpers = require("../../helpers/assorted.helpers");
const globals = require("../../helpers/global.params");
const Bills = require("../../models/tenants").Bills;

router.post("/tenant-payments", async (req, res)=>{  
    if (req.body.lease_id) {       
        let payments_history = await units.getLeasePayentsHistory(req.body.lease_id);
        payments_history = payments_history || []; 
        res.successEndData(payments_history);
    } else {
        res.successEndData([]);
    }
});

router.post('/tenant-invoices', async (req, res)=>{   
    if (req.body.lease_id) {
        let bs = await new Bills();
        bs.where_data = ' lease_id = "'+ req.body.lease_id +'" ';
        let data = await bs.all(req.body);
        res.json(data);
    } else {
        res.successEndData([]);
    }
});

router.post('/meter-readings', async (req, res)=>{
    if (req.body.lease_id) {
        let ls = await new Lease(req.body.lease_id);        
        let bs = await new Readings();
        
        bs.where_data = ' unit_code = "'+ ls.unit_code +'" AND read_date >= "'+ ls.lease_date +'" ';
        if(ls.expiry_date){
            bs.where_data+=' AND read_date <= "'+ ls.expiry_date +'" ';
        }
        let data = await bs.all(req.body);
        res.json(data);
    } else {
        res.successEndData([]);
    }
});

router.get('/', async function(req, res){
    let leases = await Tenants.getUnits(req.user_profile.email_address);
    res.renderEjs(req, "tenant-account/units", {
        page_title: "Leased Units",
        sub_header: "Units",            
        leases:leases
    });  
});

router.get('/:id', async (req, res, next)=> {   
    if(req.params.id){
        let unit_lease = await Tenants.getTenantUnitsFull(req.user_profile.email_address, req.params.id);       
        if(unit_lease.unit_code){  
            let unit_info = await units.getSingleFull(unit_lease.unit_code);           
            if (unit_info === null || unit_info === undefined) {
                next();
            } else {
                var images = JSON.parse(unit_info.unit_images);
                
                var image_paths = [] || images;
                for (var i = 0; i < images.length; i++) {
                    if(!images[i].is_default){
                        image_paths.push(images[i]);
                    }
                    
                }
                unit_info.unit_images = image_paths;
                unit_info.floor = helpers.floorToLabel(unit_info.floor);
                unit_info.rent_amount = helpers.formatMoney(unit_info.rent_amount);
                var ratings = JSON.parse(unit_info.unit_ratings);
                var ratings_message = '<p class="text-warning mb-4">*** No ratings ***</p>';
                if (ratings[0].ratings_count > 0) {
                    switch (ratings[0].average_rating) {
                        case 5:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 4:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 3:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 2:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        case 1:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star text-warning"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                            break;
                        default:
                            ratings_message = '<p class="text-muted float-left mr-3"> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> <span class="bx bx-star"></span> </p> <p class="text-muted mb-4"> ' + ratings[0].ratings_count + " - Review(s)</p>";
                    }
                }
                unit_info.ratings_message = ratings_message;
                res.renderEjs(req, "tenant-account/unit-lease", {
                    page_title: "Unit Lease",
                    sub_header: unit_info.unit_name,
                    unit_info: unit_info,                          
                    unit_lease:unit_lease
                });
            }              
        }else{
            next();
        }  
    }else{
        next();
    }   
});


module.exports = router;