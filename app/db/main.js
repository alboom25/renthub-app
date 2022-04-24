const db = require("./db.queries");    

class Database{

    constructor(){
       
    }

    async sql(sql, params=null){
        let res = await db.query(sql, params);
        return res;
    }

    async get(table_name, columns=null, where_data=null){
        let res = await db.get(table_name, columns, where_data);
        return res;        
    }

    async insert(table_name, data){      
        let res = await db.insert(table_name, data);
        return res;        
    }

    async replace(table_name, data){      
        let res = await db.replace(table_name, data);
        return res;        
    }
    async update_db(table_name, data, where_data){      
        let res = await db.update_db(table_name, data, where_data);
        return res;         
    }

    async delete_entry(table_name, column_data){
        let res = await db.delete(table_name, column_data);
        return res;       
    }
}

module.exports = Database;