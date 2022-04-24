const express = require("express");
const router = express.Router();
const globals = require("../../helpers/global.params");
const validator = require("../../libs/validator");
const validation_helper = require("../../helpers/validation.helper");

const uuid = require("uuid");
const managers = require("../../models/properties").Managers;
const user_groups = require("../../models/properties").UserGroups;
const props = require("../../models/properties").Properties;
const user = require("../../models/users").Users;
const leases = require("../../models/units").Leases;
const upcomings = require("../../models/units").UpcomingLeases;
const moment = require("moment");

router.get("/", (req, res)=>{  
  res.renderEjs(req, "leases/terminations", {
      
      
      
      page_title: "Leases",
      sub_header: "Terminations",      
      
  });      
});


router.post("/", async(req, res)=>{
  switch (req.query.action){
    case "get-upcoming":
      let bs = await new upcomings();
      bs.where_data = 'user_code = "' + req.session.user_code + '"';
      let data = await bs.all(req.body);
      res.json(data);      
      break;
    case 'extend-lease':
      if(req.body.id){
        leases.getByIdFull(req.body.id, (lease_info)=>{
          if(lease_info){
            var bsd = moment(new Date(lease_info.expiry_date));
            var dn = moment(moment().format());
            var d_days = bsd.diff(dn, "days");
            if(d_days >=0){
              var obj = {expiry_date:null};
              leases.Update(obj, req.body.id, (updated)=>{
                if(updated){
                  res.successEnd("The selected lease has been extended");
                }else{
                  res.errorEnd("The selected lease cannot be extended");
                }
              });
            }else{
              res.errorEnd("The selected lease cannot be extended");
            }           
          }else{
            res.errorEnd("Failed! target lease not existing or expired");
          }
        });
      }else{
        res.errorEnd("Failed! invalid or missing parameters");
      }
      break;
    case 'process-refund':
      if(req.body.lease_id){
        leases.getByIdFull(req.body.lease_id, (lease_info)=>{
          if(lease_info){
            if(lease_info.refund_processed){
              res.errorEnd("Failed! A refund has aready been processed for the target lease");
            }else{
              const bill_id = uuid.v4();
              var entries = [];
              var damages = req.body.damages || [];
              for(var i = 0; i <damages.length; i++){
                var obj = {
                  "bill_id": bill_id,
                  "description": damages[i]["Particular"],                
                  "amount": - parseFloat(damages[i]["Amount"])
                };
                entries.push(obj);
              }

              var deps = JSON.parse(lease_info.deposists) || [];
              for(var i = 0; i <deps.length; i++){
                var obj = {
                  "bill_id": bill_id,
                  "description": "Deposit - "+ deps[i]["Deposit Name"],                
                  "amount": parseFloat(deps[i]["Amount"])
                };
                entries.push(obj);
              }

              var bill_obj = {
                bill_id:bill_id,
                bill_Date: moment().format(),
                bill_due_date: lease_info.expiry_date,
                target_group: 2,
                target_person_id: lease_info.tenant_id,
                property_code: lease_info.property_code,  
              };

              if(entries.length>0){
                leases.createPayable(bill_obj, entries, req.body.lease_id, (created)=>{
                  if(created){
                    res.successEnd("Success! The lease termination invoice has been processed successfully");
                 //find tenant and notify
                  }else{
                    res.errorEnd("Failed! Unable to create the lease termination invoice. Please try again later");
                  }
                });
              }else{
                leases.clearBlank(req.body.lease_id, (created)=>{
                  if(created){
                    res.successEnd("Success! The lease termination has been processed successfully");
                 //find tenant and notify
                  }else{
                    res.errorEnd("Failed! Unable to process the lease termination. Please try again later");
                  }
                });
              }              
            }
          }else{
            res.errorEnd("Failed! target lease not existing or expired");
          }
        });
      }else{
        res.errorEnd("Failed! invalid or missing parameters");
      }   
      break;
    case 'get-upcoming-count':
      //leases.getUpcomingCount(req.session.user_code, (lease_count)=>{
        res.successEnd(9);
     
      break;
    default:
      res.errorEnd("Failed! invalid request submitted");
  }
});

 

module.exports = router;