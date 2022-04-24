const express = require("express");
const router = express.Router();
const helpers = require("../../helpers/assorted.helpers");
const app_helper = require("../../helpers/app.helpers");
const globals = require("../../helpers/global.params");
const reports = require("../../models/reports").AdminReports;
const fs = require("fs");
const path = require("path");

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

router.post('/display', async function (req, res){     
    var temp_path = path.join(globals.views_dir, "templates", "report.html");   
    fs.readFile(temp_path, "utf8", async function(err, fd) {
        if (err) {
            res.successEnd(`<div class="alert alert-warning">Cannot generate report view. Please try again later</div>`);
        } else {
            var report_template = fd.toString();   
            let report_from = 'N/A'  
            let report_to = 'N/A'       
            var replacer = new RegExp( "<%report_from%>", "g");
            report_template = report_template.replace(replacer, report_from);
           
            replacer = new RegExp("<%report_to%>", "g");
            report_template = report_template.replace(replacer, report_to);
          
            replacer = new RegExp("<%property_name%>", "g");
            report_template = report_template.replace(replacer, );            
           
            let report_table;
            let report_name;
            switch(req.body.report_id){
                case '10':
                    let tenants = await reports.tenants(req.session.property_code);            
                    report_table = helpers.jsonToTable(tenants);      
                    report_name = 'All Tenants'             
                    
            }

            replacer = new RegExp("<%report_name%>", "g");
            report_template = report_template.replace(replacer, report_name);

            replacer = new RegExp("<%report_table%>", "g");
            report_template = report_template.replace(replacer, report_table);
            res.successEnd(report_template);
        }
    });  
   
});

module.exports = router;