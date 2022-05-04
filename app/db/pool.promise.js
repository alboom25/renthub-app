const mysql = require('mysql');
const globals = require("../helpers/global.params");

let local_pool;

async function promisePool(){      
    if (local_pool) return local_pool;
    local_pool =  await mysql.createPool({
        host: globals.env.DB_HOST,
        user: globals.env.DB_USER,
        password: globals.env.DB_PASSWORD,
        database: globals.env.DB_NAME,
        insecureAuth: true,
        connectionLimit: 100,
        waitForConnections: true,
        charset: "utf8",
        queueLimit: 0,
        debug: false,
        dateStrings:true
    });
    return local_pool;
}

async function query(sql, params=[]){
    let pool = await promisePool();
    return new Promise(( resolve, reject ) => {
        let res = pool.query(sql, params, (err, data, fields) => {
            if (err) {               
                reject(err);
            } else {
                resolve([data, fields, res.sql]);
            }
        });
    });   
}

exports.query = query;

class Transaction{
    
    constructor(){
        this.conn;
    }
    async begin(){    
        this.conn = await this.getConnection();
        await this.query('START TRANSACTION');
    }

    async getConnection(){
        let pool = await promisePool();
        return new Promise(( resolve, reject ) => {
         pool.getConnection( (err, connection) => {
          if (err) {
            reject( err );
          } else {
            resolve(connection);
          }
         });
        });   
    }

    query(sql, params){
        return new Promise(( resolve, reject ) => {
            let res = this.conn.query(sql, params, ( err, rows, fields) => {
                if ( err ) {
                    this.conn.release();
                    reject( err );
                } else {
                    resolve([rows, fields, res.sql])
                }                
            })
        });
    }

    async insert(table_name, data){   
        let [res] = await this.query("INSERT INTO " + table_name + " SET ?;", data);
        return res;
    }

    async replace(table_name, data){    
        let [res] = await this.query("REPLACE INTO " + table_name + " SET ?;", data);
       return res;
    }

    async update(table_name, data, where_data){
        let sql = "UPDATE " + table_name +" SET " + Object.keys(data).join(' = ?, ') + " = ? WHERE " + Object.keys(where_data).join(' = ?') + " = ?";                  
        let temp = Object.values(data).concat(Object.values(where_data));            
        let [res] = await this.query(sql, temp);   
        return res;
    }

    async delete(table_name, where_data){    
        let sql = "DELETE FROM " + table_name +" WHERE " + Object.keys(where_data).join(' = ? AND') + " = ?";           
        let temp = Object.values(where_data).concat(Object.values(where_data));           
        let [res] = await this.query(sql, temp);  
        return res;
    }

    async sql(sql, params) {
        let [res, fields, sql_string] = await this.query(sql, params);        
        return res;
    }

    async commit() {
        let res = await this.query('COMMIT;');
        this.conn.release();
        return res;
    }

    async rollback(){
       // let res = await this.query('ROLLBACK;');        
        //this.conn.release();
        //return res;
        return 1;
    }    
}

exports.Transaction = Transaction;


