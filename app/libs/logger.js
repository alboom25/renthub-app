const fs = require("fs");
const path = require("path");
const moment = require("moment");
const globals = require("../helpers/global.params");

class Logger {   
    static log(error) {     
        var file_name = path.join(globals.basedir,'app', 'errors', "errors-" + moment().format().replace("-", "-").split("T")[0].replace("-", "-") + ".log");
        var error_time = moment().format("DD-MM-YYYY hh:mm:ss a");
        if(error.message.includes('Cannot delete or update a parent row')) return;
        fs.appendFile(file_name, error_time + ":\n "+ error.stack +'\n' + error.sql + "\n====================================================\n", function (err) {
            //if (err) throw err;
            // console.log('Saved!');
        });
    }

    static promise(p){      
        var file_name = path.join(globals.basedir,'app', 'errors', "errors-" + moment().format().replace("-", "-").split("T")[0].replace("-", "-") + ".log");
        var error_time = moment().format("DD-MM-YYYY hh:mm:ss a");       
        fs.appendFile(file_name, error_time + `:\n ${p.stack}\n====================================================\n`, function (err) {
            //if (err) throw err;
            // console.log('Saved!');
        });
    }
}

module.exports = Logger;
