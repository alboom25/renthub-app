const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');

class Package extends DB{
    constructor(id){
        super();   
        return (async () => {
           if(id){  
             await this.loadExisting(id);           
           }
            return this; 
        })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_packages', null, {'package_id':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }
}

class Packages extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'tbl_packages';
    }   

    static async getPremium(min_props){
        let res = await sql.query("SELECT a.*, ifnull(b.subscriptions,0)subscriptions from (SELECT * FROM `tbl_packages`WHERE package_name != 'DEMO' AND maximum_properties >= ? ORDER BY maximum_units ASC) a left join (SELECT package_id, count( package_id ) subscriptions FROM tbl_subscriptions GROUP BY package_id ORDER BY count( package_id ) DESC)b on a.package_id = b.package_id;", [min_props]);
        return res;
    }
}

module.exports = {Package, Packages}