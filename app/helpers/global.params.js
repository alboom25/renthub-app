const path = require("path");

class Globals{
   constructor(){
    this.public_dir;
    this.basedir;
    this.socket_io;  
    this.views_dir;
    this.private_dir;
    this.user_profile;
    this.env;
   }
}
module.exports = Globals;