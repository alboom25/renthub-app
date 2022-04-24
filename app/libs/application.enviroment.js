const globals = require('../helpers/global.params');
const path = require('path');
const fs = require('fs');

class Enviroment{
    constructor(enrivoment){       
        this.env = enrivoment || "development";     
    }

    ENV(){
        var file = ".env." + this.env;
        var file_path = path.join(globals.basedir, file);
        if (fs.existsSync(file_path)) {
            const data = fs.readFileSync(file_path,{encoding:'utf8', flag:'r'});
            var lines = data.split("\n");
           
            var output =  {};
            for (var i = 0; i <lines.length; i++) {              
                var line = lines[i].trim();                
                if (line.length>2){
                    var pars = line.split("=");
                    if(pars.length==2){                       
                        output[pars[0].toString()] = pars[1];                       
                    }
                }
            }
            return output;
        }else{
            return {};
        }
    }
}

module.exports = Enviroment;