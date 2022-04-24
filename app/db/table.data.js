const db = require("./db.queries"); 

class TableData{   
    constructor(){        
        this.columns = [];
        this.summation_columns = {};
        this.where_data = '';
        this.table_name ='';
    }

    async all(options=null){ 
        if(options){           
            let sql = 'SELECT ' + this.columns.join() + ' FROM ' + this.table_name;
            let res = [];
            if(options.search.value.length>0){           
                let search_cols=[];
                for (let i=0; i<options.columns.length;i++){
                    if(options.columns[i].searchable && options.columns[i].data){                    
                        search_cols.push(options.columns[i].data);
                    }
                }
                
                let from_string = search_cols.join(" LIKE ? OR ")+" LIKE ?";  
                        
                if(this.where_data.length>0){
                    sql+= ' WHERE ' + this.where_data + ' AND (' +from_string + ')';
                }else{
                    sql+= ' WHERE (' + from_string + ')';  
                } 
                if(options.order){
                    if(options.order.length>0){
                        sql+=' ORDER BY ' + options.columns[options.order[0].column].data + ' ' + options.order[0].dir;
                    }   
                }               
    
                sql+=' LIMIT '+ options.start +', '+ options.length ;    
                
                let where_cols = Array(search_cols.length).fill('%' + options.search.value + '%'); 

                res = await db.query(sql, where_cols);
               
            }else{         
                if(this.where_data.length>0){
                    sql+= ' WHERE ' + this.where_data ;           
                }  
                if(options.order){
                    if(options.order.length>0){
                        sql+=' ORDER BY ' + options.columns[options.order[0].column].data + ' ' + options.order[0].dir;
                    }    
                }               
    
                sql+=' LIMIT '+options.start +', '+ options.length ; 
              
                res = await db.query(sql);            
            }
            let total_sql = 'SELECT COUNT(*) AS records FROM ' + this.table_name;
            if(this.where_data.length>0){
                total_sql+= ' WHERE ' + this.where_data ;           
            }  

            let total = await db.query(total_sql);  
            
            let filtered = 0;
            if(total[0]){
                filtered = total[0].records;
            }
            if(options.search.value.length>0){
                filtered = res.length;
            }
            let output = {recordsFiltered:filtered, recordsTotal:total[0].records, data: res};
          
            return output;
        }else{                     
            let res = await db.get(this.table_name,this.columns);  
            return res;
        }        
    }

    async metadata(){    
        let output = {};
                    
        for (var key in this.summation_columns) {               
            let sql = 'SELECT ' + this.summation_columns[key] + '('+ key +') AS '+ key + ' FROM ' + this.table_name;
            if(this.where_data.length>0){
                sql += ' WHERE ' + this.where_data
            }

            let rows = await db.query(sql);
            let res=0;
            if(rows.length==1){
                res= rows[0][key];       
            }
            output[key]=res;               
        }           
        return output;
    }    
}

module.exports = TableData;