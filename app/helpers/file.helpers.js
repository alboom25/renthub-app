const fs = require("fs");
class fileHelpers {
    static upload_file(raw_file, file_name) {
        return new Promise((resolve, reject) => {
            raw_file.mv(file_name, function (err) {
                if (err) {                   
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });       
    }
    
    static delete_file(file_path) {
        const not_ok = file_path === null ||  file_path === "" || file_path ===undefined;
        if(!not_ok){           
            fs.unlink(file_path, function (err) {
                //if (err) console.log(err);
            });
        }       
    }

    static createFile(data, filepath) {
       return new Promise((resolve)=>{
            fs.writeFile(filepath, data, (err) => {
                if (err) {
                    resolve(0);
                } else {
                    resolve(1);
                }
            });
       });
    }
}
module.exports = fileHelpers;
