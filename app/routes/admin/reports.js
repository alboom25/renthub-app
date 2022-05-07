const express = require("express");
const router = express.Router();
const helpers = require("../../helpers/assorted.helpers");
const app_helper = require("../../helpers/app.helpers");
const globals = require("../../helpers/global.params");
const reports = require("../../models/reports").AdminReports;
const Properties = require("../../models/properties").Properties;
const fs = require("fs");
const path = require("path");
const moment = require("moment");

router.all('*', app_helper.checkProperty, function (req, res, next) {
	next();
});

router.get("/home", async function(req, res) {	
	res.renderEjs(req, "reports/home", {
        page_title: "Reports",
        sub_header: "Reports"        
    });
});

router.get('/download', async function (req, res){  
    var temp_path = path.join(globals.views_dir, "templates", "report.html");
    fs.readFile(temp_path, "utf8", function(err, fd) {
        if (err) {
            //logger.error(err);
        } else {
            var report_template = fd.toString();
            var search = "<%bill_code%>";
            var replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.bill_code);

            search = "<%full_name%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.tenant_name);

            search = "<%bill_month_year%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, helpers.monthNames[invoice_data.bill_month - 1] + ", " + invoice_data.bill_year);

            search = "<%unit_name%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.unit_name);

            search = "<%bill_code%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.bill_code);

            search = "<%bill_date%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.bill_date);

            search = "<%phone_number%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.phone_number || "");

            search = "<%email_address%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.email_address || "");

            search = "<%property_name%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.property_name);

            search = "<%property_address%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, invoice_data.property_address || "");

            var bills = JSON.parse(invoice_data.bills_breakdown);
            var bill_details = "";
            for (var i = 0; i < bills.length; i++) {
                var row = "<tr><td>" + bills[i].bill_name + '</td><td class="text-right">' + helpers.formatDecimal(bills[i].bill_amount) + "</td> </tr>";
                bill_details += row;
            }

            search = "<%bill_details%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, bill_details);

            var payments = JSON.parse(invoice_data.payments_breakdown);
            var payment_details = "";
            for (var i = 0; i < payments.length; i++) {
                var row = '<tr class="font-weight-boldest"><td>' + payments[i].payment_date + "</td><td>" + payments[i].payment_method + '</td><td class="pr-0 pt-7 text-right">' + helpers.formatDecimal(payments[i].payment_amount) + '</td><td class="text-right">' + payments[i].payment_ref + "</td></tr>";
                payment_details += row;
            }

            search = "<%payment_details%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, payment_details);

            search = "<%total_amount%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, helpers.formatMoney(invoice_data.total_amount));

            search = "<%paid_amount%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, helpers.formatMoney(invoice_data.paid_amount));

            var balance = invoice_data.total_amount - invoice_data.paid_amount;
            search = "<%balance%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, helpers.formatMoney(balance));

            var watermark = "<div style=\"border: 4px solid #008000;border-radius: 6px; color: #008000; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 24pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 18px;\"> CLEARED </div>";
            if (balance > 0) {
                watermark = "<div style=\"border: 4px solid #F53333;border-radius: 6px; color: #F53333; opacity:0.6; position: absolute; z-index: 100; left:40%; top:30%; font-size: 24pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding:12px 18px;\"> UNCLEARED </div>";
            }

            var methods = [];
            if (invoice_data.payment_methods !== null) {
                methods = invoice_data.payment_methods;
            }
            var part1 = "";
            for (var i = 0; i < methods.length; i++) {
                var ind = parseInt(i + 1);
                part1 += ind.toString() + ": <strong>" + methods[i]["Payment Mode"] + "</strong> - " + methods[i]["Payment Instructions"] + "<br>";
            }

            search = "<%payment_instructions%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, part1);

            search = "<%watermark%>";
            replacer = new RegExp(search, "g");
            report_template = report_template.replace(replacer, watermark);

            res.downloadPDF(report_template, invoice_data.bill_code);
        }
    });
});

router.post('/load', async function (req, res){     
    var temp_path = path.join(globals.views_dir, "templates", "report.html");   
    fs.readFile(temp_path, "utf8", async function(err, fd) {
        if (err) {
            res.successEnd(`<div class="alert alert-warning">Cannot generate report view. Please try again later</div>`);
        } else {            
            var report_template = fd.toString();   
            let report_from = 'N/A';
            let report_to = 'N/A' ;     
            var prop_name = await Properties.name(req.session.property_code);
          
                    
           
            let report_table;
            let report_name;

            switch(req.body.report_id){
                case '10':
                    var tenants = await reports.tenants(req.session.property_code);            
                    report_table = helpers.jsonToTable(tenants);      
                    report_name = 'All Tenants' 
                    break; 
                case '11':         
                    var tenants = await reports.active_tenants(req.session.property_code);            
                    report_table = helpers.jsonToTable(tenants);      
                    report_name = 'Active Tenants'  
                break;
                case '20':
                    var all_units = await reports.all_units(req.session.property_code);            
                    report_table = helpers.jsonToTable(all_units);      
                    report_name = 'All Units'  
                break;
                case '21':
                    var occupied_units = await reports.occupied_units(req.session.property_code);            
                    report_table = helpers.jsonToTable(occupied_units);      
                    report_name = 'Occupied Units'  
                break;
                case '22':
                    var unoccupied_units = await reports.unoccupied_units(req.session.property_code);            
                    report_table = helpers.jsonToTable(unoccupied_units);      
                    report_name = 'Unoccupied Units' 
                break;
                case '30':
                    var active_leases = await reports.active_leases(req.session.property_code);            
                    report_table = helpers.jsonToTable(active_leases);      
                    report_name = 'Active Leases' 
                break;
                case '31':                   
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    var expired_leases = await reports.expired_leases(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(expired_leases);      
                    report_name = 'Expired Leases' 
                break;
                case '40':
                    var meter_readings = await reports.meter_readings(req.session.property_code);            
                    report_table = helpers.jsonToTable(meter_readings);      
                    report_name = 'Meter Readings' 
                break;
                case '50':                   
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    var work_orders = await reports.work_orders(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(work_orders);      
                    report_name = 'All Work Orders' 
                break;
                case '60':
                    prop_name = 'ALL';
                    var all_suppliers = await reports.all_suppliers(req.session.user_code);            
                    report_table = helpers.jsonToTable(all_suppliers);      
                    report_name = 'All Suppliers/Vendors' 
                break;
                case '70':
                    prop_name = 'ALL';
                    var accounts_list = await reports.accounts_list(req.session.user_code);            
                    report_table = helpers.jsonToTable(accounts_list);      
                    report_name = 'Accounts List' 
                break;
                case '71':       
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');            
                    var expenses_list = await reports.expenses_list(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(expenses_list);      
                    report_name = 'Expenses' 
                break;
                case '72':       
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');            
                    var tenant_invoices = await reports.tenant_invoices(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(tenant_invoices);      
                    report_name = 'Tenant Invoices' 
                break;
                    case '73':       
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');            
                    var tenant_payments = await reports.tenant_payments(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(tenant_payments);      
                    report_name = 'Tenant Payments' ;
                break;               
                case '74':       
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');            
                    var supplier_invoices = await reports.supplier_invoices(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(supplier_invoices);      
                    report_name = 'Supplier Invoices' ;
                break;
                case '75':       
                    var t_range = req.body.daterange.split('-');
                    var date_from = moment(t_range[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    var date_to = moment(t_range[1], 'MM/DD/YYYY').format('YYYY-MM-DD');
                    report_from = moment(t_range[0], 'MM/DD/YYYY').format('DD-MM-YYYY');
                    report_to = moment(t_range[1], 'MM/DD/YYYY').format('DD-MM-YYYY');            
                    var supplier_payments = await reports.supplier_payments(req.session.property_code,date_from,date_to);            
                    report_table = helpers.jsonToTable(supplier_payments);      
                    report_name = 'Supplier Payments' ;
                break;
            }

            var replacer = new RegExp("<%property_name%>", "g");
            report_template = report_template.replace(replacer, prop_name);  

            replacer = new RegExp( "<%report_from%>", "g");
            report_template = report_template.replace(replacer, report_from);
           
            replacer = new RegExp("<%report_to%>", "g");
            report_template = report_template.replace(replacer, report_to);

            replacer = new RegExp("<%report_name%>", "g");
            report_template = report_template.replace(replacer, report_name);
           
            replacer = new RegExp("<%report_table%>", "g");
            report_template = report_template.replace(replacer, report_table);           

            let download = req.query.action || '';
            if (download =='download') {                
                let file_name = report_name;
                file_name.replace(' ', '_');
                res.downloadPDF(report_template, file_name);
            }else {
                res.successEnd(report_template);
            }
        }
    });  
   
});

module.exports = router;