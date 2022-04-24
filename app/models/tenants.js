const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');
const uuid = require("uuid");
const helpers = require("../helpers/assorted.helpers");
const moment = require("moment");

class Tenant extends DB{
    constructor(property_code, tenant_id=null){
        super();
        return (async () => {
            if(tenant_id){  
              await this.loadExisting(property_code, tenant_id);
            }else{
                this.property_code = property_code;                
                this.tenant_id = uuid.v4();
                this.default_color = "#" + Math.random().toString(14).substr(5, 6);
            }
            return this; 
         })();     
    }

    async loadExisting(property_code, tenant_id){
        let res =  await this.get('tbl_tenants', null,{'property_code':property_code, tenant_id:tenant_id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_tenants', this);
        return res;
    }

    async update(){
        let data = []; 
        Object.assign(data, this);
        delete data['tenant_id'];
        let res =  await this.update_db('tbl_tenants', data, {tenant_id:this.tenant_id});
        return res;
    }

    async delete(){
        let res = await sql.delete('tbl_tenants', {tenant_id:this.tenant_id});
        return res;
    }
}

class Tenants extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_tenants';
    }  

    static async allBrief(property_code){
        let res = await sql.query("SELECT tenant_id, IF ( phone_number IS NULL OR phone_number ='', CONCAT( first_name, ' ', last_name ), CONCAT( first_name, ' ', last_name, ' - ', phone_number ) ) AS tenant_name FROM tbl_tenants WHERE property_code =? ORDER BY DATE(created_on) DESC;", [property_code]);
        return res;
    }
    
    static async displayImage(property_code, tenant_id){
        let res = await sql.get('tbl_tenants',['tenant_id', 'first_name', 'last_name', 'image_path', 'default_color'],{property_code:property_code, tenant_id:tenant_id});
        return res.length==1 ? res[0] : [];
    }

    static async frontId(property_code, tenant_id){
        let res = await sql.get('tbl_tenants',['id_front_path'],{property_code:property_code, tenant_id:tenant_id});
        return res.length==1 ? res[0].id_front_path : '';
    }

    static async backId(property_code, tenant_id){
        let res = await sql.get('tbl_tenants',['id_back_path'],{property_code:property_code, tenant_id:tenant_id});
        return res.length==1 ? res[0].id_back_path : '';
    }

    static async accountsInfo(tenant_id){        
        let res = await sql.get('vw_tenant_values',null,{tenant_id:tenant_id});
        return res.length==1 ? res[0] : [];
    }

    static async assigned(property_code, floors) {
        let res= await sql.query("SELECT first_name, last_name, company_name, phone_number, email_address, tbl_units.unit_name FROM vw_active_leases LEFT JOIN tbl_tenants ON tbl_tenants.tenant_id = vw_active_leases.tenant_id LEFT JOIN tbl_units ON tbl_units.unit_code = vw_active_leases.unit_code WHERE vw_active_leases.property_code =? AND tbl_units.floor IN ( ? );", [property_code, floors]);
        return res.length > 0 ? res :[];
    }

    static async getUnits(email_address){
        let res = await sql.get('vw_leases_full',null,{email_address:email_address});
        return res;        
    }

    static async getTenantUnitsFull(email_address,lease_id){
        let res = await sql.get('vw_leases_full', null, {email_address:email_address, lease_id:lease_id});
        return res.length ==1? res[0]: {};
    }
}

class Bill extends DB{
    constructor(property_code, id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(property_code, id);          
            }else{
                this.bill_code = helpers.generate_random_upper(10);
            }
            return this; 
         })();     
    }

    async loadExisting(property_code, id){
        let res =  await this.get('vw_tenant_invoices', null,{'bill_id':id, 'property_code':property_code});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data);             
        }
    }

    async save(bill_entries, delete_meters=0){       
        let trans = [];

        let c = {sql:"INSERT INTO tbl_tenant_bills SET ?;", data:[this]};
        trans.push(c);
        
        c = {sql:"INSERT INTO tbl_tenant_bills_breakdown (bill_id, bill_name, bill_amount) VALUES ?;", data:[bill_entries.map((item) => [item.bill_id, item.bill_name, item.bill_amount])]};
        trans.push(c);    
        
        if(delete_meters) {
            c = {sql:"UPDATE tbl_units_meter_readings SET bill_generated = 1 WHERE unit_code =  ?;", data:[this.unit_code]};
            trans.push(c);    
        }

        let res = await sql.transaction(trans);      
        return res;
    }

    async update(bill_entries){
        let trans = [];

        let c = {sql:"DELETE FROM tbl_tenant_bills_breakdown WHERE bill_id = ?;", data:[this.bill_id]};
        trans.push(c);
        
        c = {sql:"INSERT INTO tbl_tenant_bills_breakdown (bill_id, bill_name, bill_amount)VALUES ?;", data:[bill_entries.map((item) => [item.bill_id, item.bill_name, item.bill_amount])]};
        trans.push(c);     

        let res = await sql.transaction(trans);
        return res;
    }

    async cancel(){
        let res = await sql.update_db('tbl_tenant_bills', {is_cancelled:1},{bill_id:this.bill_id});
        return res;
    }

    async delete_entry(){       
        let trans = [];

        let c = {
            method:'DELETE',
            table_name:'tbl_tenant_bills_breakdown',
            where_data: {bill_id:this.bill_id}
        };
        trans.push(c);

        c = {
            method:'DELETE',
            table_name:'tbl_tenant_bills',
            where_data: {bill_id:this.bill_id}
        };
        trans.push(c);     

        let res = await sql.transaction(trans);
        return res;
    }
}

class Bills extends Table{
    constructor(){
        super();
        this.columns = ['bill_id', 'unit_code', 'unit_name',  'bill_code', "DATE_FORMAT(bill_date,'%d-%m-%Y') AS bill_date", 'tenant_id', 'tenant_name', 'total_amount', 'paid_amount', 'is_cancelled'];
        this.table_name = 'vw_tenant_invoices';        
    }    

    static async billInfo(property_code, bill_id, use_code='false'){
        let wdata = {property_code:property_code, bill_id: bill_id};
        if(use_code=='true'){
            wdata = {property_code:property_code, bill_code: bill_id};
        }
        let res = await sql.get('vw_tenant_invoices', null, wdata);
        return res.length ==1 ? res[0] : null;
    }    

    static async unpaidInvoices(property_code, defaulted_days, balance_above) {
        let res = await sql.query("SELECT bill_code, bill_date, due_date, unit_name, property_name, first_name, last_name, phone_number, email_address, total_amount, paid_amount, total_amount - paid_amount AS balance FROM vw_tenant_invoices WHERE is_cancelled = 0 AND (total_amount - paid_amount) > ? AND DATEDIFF( Date( Now( ) ), DATE( due_date ) ) >? AND property_code =?;", [balance_above, defaulted_days, property_code]);
        return res.length>0 ? res :[];
    }

    static async unpaidTotal(property_code){
        let res = await sql.query("SELECT IFNULL( SUM( IF ( total_amount - paid_amount > 0, total_amount - paid_amount, 0 ) ), 0 ) AS unpaid_amount  FROM vw_tenant_invoices WHERE is_cancelled = 0 AND property_code =?;", [property_code]);       
        return res.length==1 ? res[0].unpaid_amount :0;
    }

    static async unpaidSingle(tenant_id){
        let res = await sql.query('SELECT * FROM vw_tenant_invoices WHERE (paid_amount < total_amount) AND tenant_id = ? AND is_cancelled = 0 ORDER BY bill_date ASC LIMIT 1;',[tenant_id]);        
        return res.length == 1? res[0] : null;
    }

    static async list(tenant_id){
        let res = await sql.query('SELECT bill_month, bill_year, unit_name, bill_id, bill_code, (total_amount - paid_amount) as balance  FROM vw_tenant_invoices WHERE (paid_amount < total_amount) AND tenant_id = ? AND is_cancelled = 0 ORDER BY bill_date ASC;',[tenant_id]); 
        return res;
    }

}

class Payment extends DB{
    constructor(property_code, id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(property_code, id);          
            }else{
                this.payment_id = uuid.v4();
            }
            return this; 
         })();     
    }

    async loadExisting(property_code, id){
        let res =  await this.get('vw_tenant_payments', null,{'payment_id':id, 'property_code':property_code});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data);             
        }
    }

    async save(excess, tenant_id, excess_payment_id=null, original_bill_id=null, carried_forward=0){        
        let trans = [];         
        let t = {
            transaction_no: moment().format('HHmmMMDDYYYY') + helpers.generate_random_upper(8),
            transaction_date:  moment().format(),
            amount_in: this.payment_amount,
            amount_out: 0,
            completed: 1,
            target_account: this.target_account,
            posted_by: this.recorded_by,
            original_bill_id:original_bill_id || this.payment_id,           
            payment_method:this.payment_method,
        };
        
        this.original_payment_id = original_bill_id;
        this.carried_forward = carried_forward;
        let c = {
            method:'INSERT',
            table_name:"tbl_tenant_bills_payments", 
            data:this
        };
        trans.push(c);     

        c = {
            method:'INSERT',
            table_name:"tbl_transactions",
            data:t
        };
        trans.push(c);  

        if(excess_payment_id){           
            c = {
                method:'DELETE',
                table_name:"tbl_tenant_excess_payments",
                where_data:{payment_id:excess_payment_id}
            };
            trans.push(c); 
        }
        
        if(excess>0){
            let obj = {
                payment_id:uuid.v4(),
                payment_date: moment().format(),
                excess_amount:excess,
                original_bill_id: original_bill_id || this.payment_id,
                tenant_id:tenant_id,
                target_account: this.target_account,
                payment_method:this.payment_method,
                added_by:  this.recorded_by,
                payment_ref:this.payment_ref,
            };
            c = {
                method:'INSERT',
                table_name:"tbl_tenant_excess_payments",
                data:obj
            };
            trans.push(c); 
        }

        let res = await sql.transaction(trans);        
        return res;
    } 

    async cancel(info){       
        let trans = [];  
        let c = {
            method: 'UPDATE',
            table_name:'tbl_tenant_bills_payments',
            data: info,
            where_data: {payment_id:this.payment_id}            
        };
        trans.push(c); 
        c = {
            method: 'DELETE',
            table_name:'tbl_tenant_excess_payments',          
            where_data: {original_bill_id:this.payment_id}            
        };
        trans.push(c);

        c = {
            method: 'DELETE',
            table_name:'tbl_tenant_bills_payments',          
            where_data: {original_payment_id:this.payment_id}            
        };
        trans.push(c);

        c = {
            method: 'UPDATE',
            table_name:'tbl_transactions',
            data: {completed:0},
            where_data: {original_bill_id:this.payment_id}            
        };
        trans.push(c);
       
        let res = await sql.transaction(trans);
        return res;  
    }

    async delete_entry(){       
        let trans = [];

        let c = {sql:"DELETE FROM tbl_tenant_bills_breakdown WHERE bill_id = ?;", data:[this.bill_id]};
        trans.push(c);
        
        c = {sql:"DELETE FROM tbl_tenant_bills WHERE bill_id = ?", data:[this.bill_id]};
        trans.push(c);     

        let res = await sql.transaction(trans);
        return res;
    }
}

class Payments extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_tenant_payments';        
    }    

    static async add(info){
        let res = await sql.insert('tbl_tenant_bills_payments', info);
        return res;
    }  

    static async addExcess(obj){
        let res = await sql.insert('tbl_tenant_excess_payments', obj);
        return res;
    }

    static async excess(tenant_id){      
        let res = await sql.query('SELECT * FROM tbl_tenant_excess_payments WHERE tenant_id = ? ORDER BY payment_date ASC LIMIT 1;',[tenant_id]); 
        return res.length == 1? res[0] : null;
    }
}

class Dashboard{
    static async data(email_address){
        let res = await sql.query(`SELECT
        * 
    FROM
        ( SELECT SUM( active_leases ) active_leases FROM vw_tenant_dashboard_data WHERE email_address =? ) tba,
        ( SELECT sum( total_paid_amount ) total_paid_amount FROM vw_tenant_dashboard_data WHERE email_address =? ) tbb,
        ( SELECT SUM( uncleared_invoices ) uncleared_invoices FROM vw_tenant_dashboard_data WHERE email_address =? ) tcc,
        ( SELECT sum( uncleared_amount ) uncleared_amount FROM vw_tenant_dashboard_data WHERE email_address =? ) tdd`, [email_address,email_address,email_address,email_address]);
       return res.length==1 ? res[0]:{};
    }

    static async graph_data(email_address){
        let res = await sql.query("SELECT a.*, ifnull( b.paid_amount, 0 ) paid_amount, ifnull( c.bill_total, 0 ) bill_total FROM ( SELECT MONTHNAME( STR_TO_DATE( tbl_months.month_val, '%m' ) ) month_name FROM tbl_months WHERE tbl_months.month_val <= MONTH ( NOW( ) ) ) a LEFT JOIN ( SELECT MONTHNAME( payment_date ) month_name, SUM( payment_amount ) paid_amount FROM vw_tenant_bills_payments WHERE is_cancelled = 0 AND YEAR ( `payment_date` ) = YEAR ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `payment_date` ), MONTH ( `payment_date` ) ) b ON a.month_name = b.month_name LEFT JOIN ( SELECT MONTHNAME( bill_date ) month_name, SUM( total_amount ) bill_total FROM vw_tenant_invoices WHERE is_cancelled = 0 AND YEAR ( `bill_date` ) = YEAR ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `bill_date` ), MONTH ( `bill_date` ) ) c ON a.month_name = c.month_name", [email_address,email_address]);
       return res;
    }

    static async month_data(email_address){
        let res = await sql.query("SELECT * FROM ( SELECT SUM( payment_amount ) paid_amount FROM vw_tenant_bills_payments WHERE is_cancelled = 0 AND MONTH ( `payment_date` ) = MONTH ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `payment_date` ), MONTH ( `payment_date` ) ) a, ( SELECT SUM( total_amount ) bill_total FROM vw_tenant_invoices WHERE is_cancelled = 0 AND MONTH ( `bill_date` ) = MONTH ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `bill_date` ), MONTH ( `bill_date` ) ) b", [email_address,email_address]);
       return res.length==1 ? res[0]:{};
    }

    static async year_data(email_address){
        let res = await sql.query("SELECT * FROM ( SELECT SUM( payment_amount ) paid_amount FROM vw_tenant_bills_payments WHERE is_cancelled = 0 AND YEAR ( `payment_date` ) = YEAR ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `payment_date` ), MONTH ( `payment_date` ) ) a, ( SELECT SUM( total_amount ) bill_total FROM vw_tenant_invoices WHERE is_cancelled = 0 AND YEAR ( `bill_date` ) = YEAR ( curdate( ) ) AND email_address = ? GROUP BY YEAR ( `bill_date` ), MONTH ( `bill_date` ) ) b", [email_address,email_address]);
       return res.length==1 ? res[0]:{};
    }

    static async all_data(email_address){
        let res = await sql.query("SELECT * FROM ( SELECT SUM( payment_amount ) paid_amount FROM vw_tenant_bills_payments WHERE is_cancelled = 0 AND email_address = ? GROUP BY YEAR ( `payment_date` ), MONTH ( `payment_date` ) ) a, ( SELECT SUM( total_amount ) bill_total FROM vw_tenant_invoices WHERE is_cancelled = 0 AND email_address = ? GROUP BY YEAR ( `bill_date` ), MONTH ( `bill_date` ) ) b", [email_address,email_address]);
       return res.length==1 ? res[0]:{};
    }
}

module.exports = {Tenant, Tenants, Bill, Bills, Payments, Payment, Dashboard}