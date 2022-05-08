const axios = require('axios');

class Assorted {
   
    static formatMoney(number) {
        let dollarUS2 = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
            useGrouping: true,
        });
        var n = parseFloat(number) || 0;
        return dollarUS2.format(n);   
    }

    static formatDecimal(number){
        var n = parseFloat(number) || 0;
    
        return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
    }

    static string_to_object(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return [];
        }
    }

    static floorToLabel(floor) {
        if (floor === 0) {
            return "Ground Floor";
        } else if (floor > 0) {
            var last_digit = floor.toString().charAt(floor.toString().length - 1);
            var res = "";
            switch (last_digit) {
                case "1":
                    res = "st";
                    break;
                case "2":
                    res = "nd";
                    break;
                case "3":
                    res = "rd";
                    break;
                case "0":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    res = "th";
                    break;
                default:
                    res = "";
            }
            return floor.toString() + res + " Floor";
        }
    }

    static titleCase(str) {
        if (str === null || str === undefined || str === "") {
            return "";
        } else {
            str = str.toLowerCase().trim();
            return str
                .split(" ")
                .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        }
    }

    static generate_random_lower(length) {
        var result = "";
        var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generate_random_upper(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generate_random_all(length) {
        var result = "";
        var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generate_random_number(length) {
        var result = "";
        var characters = "0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static todaysDate(){
        var now = new Date();
        var month = (now.getMonth() + 1);               
        var day = now.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return now.getFullYear() + '-' + month + '-' + day;    
    }

    static dateToString(user_date){        
          var month = (user_date.getMonth() + 1);               
          var day = user_date.getDate();
          if (month < 10) 
              month = "0" + month;
          if (day < 10) 
              day = "0" + day;
         return user_date.getFullYear() + '-' + month + '-' + day;    
    }

    static dateDiffInHours(a, b) {
        
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      
        return Math.floor((utc2 - utc1) / 3600000);
    }

    static browserName(userAgent){
        var browser = '';
var browserVersion = 0;

if (/Opera[\/\s](\d+\.\d+)/.test(userAgent)) {
    browser = 'Opera';
} else if (/MSIE (\d+\.\d+);/.test(userAgent)) {
    browser = 'MSIE';
} else if (/Navigator[\/\s](\d+\.\d+)/.test(userAgent)) {
    browser = 'Netscape';
} else if (/Chrome[\/\s](\d+\.\d+)/.test(userAgent)) {
    browser = 'Chrome';
} else if (/Safari[\/\s](\d+\.\d+)/.test(userAgent)) {
    browser = 'Safari';
    /Version[\/\s](\d+\.\d+)/.test(userAgent);
    browserVersion = new Number(RegExp.$1);
} else if (/Firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
    browser = 'Firefox';
}
if(browserVersion === 0){
    browserVersion = parseFloat(new Number(RegExp.$1));
}

var matches = userAgent.match(/\(([^)]+)\)/)[1]

return {browser:browser + ", ver: "+ browserVersion, os:matches};
    }

    static monthNames(){
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    static async axios_request(options){
        return new Promise(function(resolve, reject){
            axios(options)
            .then(function (response) {               
                resolve([1, response.data]);
            }).catch(function (error) {
                resolve([0, error]);
            });
        });       
    }

    static jsonToTable(json_data) {       
        let table = `<table class='report-table' style='word-break:normal; width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif;'><thead><tr style='background-color: #009879; color: #ffffff; text-align: left;'>`;
        if(json_data.length > 0){           
            table +=  "<th style='padding:4px;'>" +Object.keys(json_data[0]).join(`</th><th style='padding: 2px 4px;'>`)+"</th>"; 
            table += `</tr></thead><tbody>`;
            for(let i = 0; i < json_data.length; i++){
                let row = Object.values(json_data[i]);    
                table +=  `<tr style='border-bottom: 1px solid #dddddd;'><td style='padding: 2px 4px;'>` +row.join(`</td><td style='padding: 4px;'>`)+`</td></tr>`;  
            }
            table += `</tbody>`;
        }else{
            table +=`<div class="alert alert-warning">No data found for the reuest report<div>`;
        }
        table += `</table>`;       
        return table;
    }
}
module.exports = Assorted;
