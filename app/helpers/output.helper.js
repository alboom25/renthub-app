const fs = require("fs");
const path = require("path");
const getPage = require("./puppeteer.page");
const globals = require("../helpers/global.params");
const Properties = require("../models/properties").Properties;
const errors = require('../libs/logger');

const { createCanvas } = require("canvas");
const WIDTH = 200;
const HEIGHT = 200;

let errorEnd = function(message) {   
    if(this.headersSent)return;
    var result = {
        Status: 201,
        Message: message,
    };
    this.json(result);
}

let successEnd = function(message) {   
    if(this.headersSent)return;
    var result = {
        Status: 200,
        Message: message,
    };
    this.json(result);
}

let successEndData = function(data) {
    if(this.headersSent)return;
    var obj = {
        data: data,
        recordsTotal: data.length,
        recordsFiltered: data.length,
    };   
    this.json(obj);
}

function fileContent(file_path){
    return new Promise(function(resolve){
        fs.readFile(file_path, function (err, content) {
            if (err) {
                resolve(null)
            } else {              
                resolve(content);
            }
        });
    });
}

let endImage = async function(file_path =null, initials = null, color=null) {  
    if(this.headersSent)return;    
    this.set('Cache-Control', 'no-store');
    this.writeHead(200, { "Content-Type": "image/jpeg" });
    if(file_path){
        let content = await fileContent(file_path);
        if(content){
            return this.end(content);
        }
    }

    if(initials){
        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f2f2f2";
    
        switch (initials.length) {
            case 1:
                ctx.font = "96px Arial";
                break;
            case 2:
                ctx.font = "78px Arial";
                break;
            case 3:
                ctx.font = "72px Arial";
                break;
            case 4:
                ctx.font = "66px Arial";
                break;
            case 5:
                ctx.font = "60px Arial";
                break;
            default:
                ctx.font = "54px Arial";
        }
        var te = ctx.measureText(initials);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(initials, 100, 110 + te.emHeightDescent);
        var data = canvas.toBuffer("image/png");
        return this.end(data);
    }
    var fl = path.join(globals.private_dir, "defaults", "blank-id.jpg");
    let blank_image = await fileContent(fl);
    if(blank_image){
        return this.end(blank_image);
    }

    response.end('UNABLE TO LOAD IMAGE file');
}

let renderEjs = async function(req, file_path, options={}){
    if(this.headersSent)return;

    let p = Properties;
    let pc = await p.Available(req.session.user_code);
    let property_name='';
    if(req.session.property_code){
        property_name = await Properties.name(req.session.property_code);
    }

    let obj = {
        load_chunk: req.xhr,
        base_url: req.__base_url,
        public_url: req.public_url,
        csrfToken: req.csrfToken(),               
        user_profile: req.user_profile,
        property_count:pc,
        current_property_code: req.session.property_code,
        current_property_name:property_name
    };   
    
    Object.assign(options, obj);  
    this.render(file_path, options);
}

let  downloadPDF = async function(html, filename) {  
    if(this.headersSent)return;  
    try {
        const page = await getPage.getPage();
        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
        });
        var d = new Date();
        const file_name = filename +"_" + d.getDate()+d.getMonth()+d.getFullYear() + ".pdf"
        this.set("Content-Disposition", "attachment;filename=" +file_name );
        this.setHeader("Content-Type", "application/pdf");
        this.append("filename", file_name);
        this.send(pdfBuffer);
    } catch (e) {       
        errors.log(e);
        this.end("Unable to generate pdf!");        
    }  
}

let serveFile = function(filepath){
    if(this.headersSent)return;
    if (fs.existsSync(filepath)) {
        this.download(filepath);      
    }else{
        this.end('Unable to find the requested resource')
    }
}


module.exports.Output = function(req, res, next){    
    res.serveFile = serveFile;
    res.errorEnd = errorEnd;
    res.successEnd = successEnd; 
    res.successEndData = successEndData;
    res.downloadPDF = downloadPDF;
    res.endImage = endImage;
    res.renderEjs = renderEjs;
    next();
}

