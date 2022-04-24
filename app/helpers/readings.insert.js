const sms = require("../libs/sms.sender");
const notifications = require("../models/users").Notifications;
const units = require("../models/units").Units;
const props = require("../models/properties").Properties;
const helpers = require("../helpers/assorted.helpers");

class Inserter{
    static async registerReading(rds, mobj, user_code, readings_date, user_property, result){      
        let last_readings = await units.getSingleLastMeterReading(rds.UnitCode, mobj[0]['Meter Name'], helpers.dateToString(new Date(readings_date)));
       
        var info = {
            unit_code:rds.UnitCode,
            reading_type:mobj[0]['Meter Name'],
            read_value: rds.Reading,
            read_date: new Date(readings_date),
            read_by: user_code,
            unit_rate: mobj[0]["Rate"] || 0,
            units_used: rds.Reading - (last_readings.read_value||0)
        };
        let added = await props.addMeterReading(info, false);
        if(added){                                    
            let tenant_info = await units.currentTenant(rds.UnitCode);
            if(tenant_info){                       
                if(tenant_info.phone_number){
                    var unit_name = tenant_info.unit_name; 
                    if(user_property.floors>1){
                        unit_name += " - " + helpers.floorToLabel(tenant_info.floor);
                    }
                    unit_name +=", "+ user_property.property_name;
                    var sms_message = "Dear " + tenant_info.first_name +", the " + backinfo.reading_type +" meter reading for hse " + unit_name + " as on " + helpers.dateToString(backinfo.read_date) + " is " + backinfo.read_value.toString() + ". Unit cost is " + helpers.formatMoney(backinfo.unit_rate) +". The bill will be included in your invoice.";
                    if(last_readings.read_date){                                                   
                        sms_message += ". Your previous meter reading as on " + helpers.dateToString(last_readings.read_date) + " was " + last_readings.read_value.toString()+". Your usage is " + (backinfo.read_value - last_readings.read_value).toString() +"."
                    }

                    var other_info = {
                        first_name: tenant_info.first_name,
                        phone_number: tenant_info.phone_number,
                        unit_name: unit_name,
                        property_name: user_property.property_name,
                        user_code: user_code,
                    };
                    sms.sendSms(user_property.property_code, tenant_info.phone_number, sms_message, other_info);

                }else{
                    result(0);
                }
           }else{
            result(0);
           }
        }else{
            let unit_info = await units.getSingle(backinfo.unit_code);
            var unit_name = unit_info.unit_name;
            if(user_property.floors>1){
                unit_name += " - " + helpers.floorToLabel(unit_info.floor);
            }
            var obj = {
                note_head: "Meter Reading Failed",
                note_message:"Submitted meter readings for " + unit_name +" could not be updated",
                user_code: user_code,
                note_class: "warning",
                note_icon: "bx bx-error-alt",
              };
            notifications.Add(obj);
            result(0);                
        } 
    }
}
module.exports = Inserter;