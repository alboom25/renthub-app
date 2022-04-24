const helpers = require("../helpers/assorted.helpers");
const sms = require("../libs/sms.sender");

const tenants = require("../models/tenants").Tenants;
const Tenant = require("../models/tenants").Tenant;
const users = require("../models/users").Users;
const Bills = require("../models/tenants").Bills;
const Bill = require("../models/tenants").Bill;
const Payment = require("../models/tenants").Payment;
const property_units = require("../models/units").Units;
const units = require("../models/units").Units;
const notifications = require("../models/users").Notifications;
const props = require("../models/properties").Properties;
const ph = require("./payments");  

const uuid = require("uuid");
const moment = require("moment");

class BillGenerator {
    
    static async serverAutoGenerate(auto) {
        var hour_now = parseInt(moment().format('H'));         
        
        if (auto && hour_now != 80) return; //only send reminder at 8 am
        let active_leases = await units.activeLeases();
      
        for (var i = 0; i < active_leases.length; i++) {
            var sl = active_leases[i];
            var bsd = moment(sl.billing_start_date);
            var dn = moment(moment().format());
            var d_days = bsd.diff(dn, "days");
          

            if (d_days <= 0) {   
                var diff = dn.date() - sl.bills_payment_date;                           
               if(diff===0){       
                   let bg  = new Generator(sl);
                   bg.run();    
               }  
            }
        }
    }   
}

class Generator{
    constructor(sl){
        this.sl = sl;
    }

    async run() {
        var today = moment().format();
        var bill_entries = new Array();
        var curr_month_name = moment(moment().format()).format("MMMM");
        var bill_id = uuid.v4();
        var bill_entry = {
            bill_name: "Rent " + curr_month_name,
            bill_id: bill_id,
            bill_amount: this.sl.monthly_rent,
        };

        bill_entries.push(bill_entry);

        var bills = JSON.parse(this.sl.fixed_monthly_bills);
        for (var i = 0; i < bills.length; i++) {
            var t = parseFloat(bills[i]["Amount"]) || 0;
            bill_entry = {
                bill_name: bills[i]["Bill Name"] + " " + curr_month_name,
                bill_id: bill_id,
                bill_amount: t,
            };
            bill_entries.push(bill_entry);
        }

        let meter_bills = await units.unbilledMeterBills(this.sl.unit_code);
        var last_month =  moment().subtract(1, "month").startOf("month").format('MMMM');

        for (var i = 0; i < meter_bills.length; i++) {
            if(meter_bills[i].bill_amount>0){
                bill_entry = {
                    bill_name: meter_bills[i].reading_type + " " + last_month,
                    bill_id: bill_id,
                    bill_amount: meter_bills[i].bill_amount,
                };
                bill_entries.push(bill_entry);
            }               
        }

        var total = 0;
        for (var i = 0; i < bill_entries.length; i++) {
            total += parseInt(Object.values(bill_entries[i])[2]);
        }

       
        var bill_obj = {
            bill_id: bill_id,          
            unit_code: this.sl.unit_code,
            lease_id: this.sl.lease_id,
            bill_date: today,
            due_date: today,
            tenant_id: this.sl.tenant_id,
        };


        let bill = await new Bill(this.sl.property_code);
        Object.assign(bill, bill_obj);
        let bill_added = await bill.save(bill_entries, 1);

        if(bill_added){
            setTimeout(
                async function() {
                    await ph.autoPay(bill_obj.tenant_id);
                }, 10000); 
           
            let tenant_info = await new Tenant(this.sl.property_code, this.sl.tenant_id);
            let unit_info = await new Unit(this.sl.property_code, this.sl.unit_code);
            var unit_name = unit_info.unit_name;
            if (req.user_property.floors > 1) {
                unit_name += " - " + helpers.floorToLabel(unit_info.floor);
            }
            var sms_message = "Dear " + tenant_info.first_name + ", a new invoice has been created for " + req.user_property.property_name + ", RM " + unit_name + ". The invoice amount " + helpers.formatMoney(invoice_total);
            //send mail
            sms.sendSms(req.user_property.property_code, tenant_info.phone_number, sms_message, [], (sms_sent) => {});
           
        }else{
            //send notification to owner
            console.log('send note to owner')
        }

      
    }
}

module.exports = BillGenerator;
