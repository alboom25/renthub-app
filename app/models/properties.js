const db = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');
const uuid = require("uuid");
const path = require("path");
const moment = require("moment");
const helpers = require("../helpers/assorted.helpers");
const file_helpers = require("../helpers/file.helpers");
const globals = require("../helpers/global.params");


class Property extends DB{
    constructor(user_code, id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(user_code, id);
            }else{
                this.property_code = helpers.generate_random_upper(6);
                this.default_color = "#" + Math.random().toString(14).substr(5, 6);
                this.user_code = user_code;
            }
             return this; 
         })();     
    }

    async loadExisting(user_code, id){
        let res =  await this.get('vw_properties_all', ['*', '( income - expenses) AS net_total'],{'property_code':id, user_code:user_code});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    static async public(id){
        let res =  await db.get('vw_properties_all', null,{'property_code':id});  
        return res.length == 1 ? res[0] :null;           
    }

    async save(){
        let res =  await this.insert('tbl_properties', this);
        return res;
    }

    async update(data){      
        let res =  await this.update_db('tbl_properties', data, {property_code: this.property_code});
        return res;
    }

    async delete(){
        let res =  await this.delete_entry('tbl_properties', {property_code: this.property_code});
        return res;
    }

    async images(){
        let res = await this.get('tbl_property_images', ['image_id', 'image_description'], {property_code: this.property_code, is_default: false});
        return res;
    }    
}

class Properties extends Table{
    static async getBriefAll(user_code){
        let res = await db.get('vw_properties_all', ['property_code', 'property_name', 'property_type', 'locality_name', 'unit_types', 'property_description', 'ifnull( occupancy, 0 ) AS occupancy', 'available_units', 'occupied_units', 'format( income, 0 ) income', 'format( expenses, 0 ) expenses', 'format( income - expenses, 0 ) AS net_total', 'format( orders, 0 ) orders', 'format( unpaid_invoices, 0 ) unpaid_invoices', 'is_verified'], {user_code: user_code});
        return res;
    }

    static async getAgentBriefAll(user_code){
        let res = await db.query('SELECT property_code,property_name,property_type,locality_name,unit_types,property_description,ifnull( occupancy, 0 ) AS occupancy,available_units,occupied_units,format( income, 0 ) income,format( expenses, 0 ) expenses,format( income - expenses, 0 ) AS net_total,format( orders, 0 ) orders,format( unpaid_invoices, 0 ) unpaid_invoices,is_verified FROM vw_properties_all WHERE property_code IN(SELECT property_code FROM)', [user_code]);
        return res;
    }

    static async getBriefSingle(property_code) {
        let res = await db.get('vw_properties_all', null, {property_code: property_code});
        return res.length === 1 ? res[0] : {};
    }

    static async list(user_code){
        let res = await db.get('vw_properties_all', ['property_code', 'property_name'], {user_code: user_code});
        return res;
    }

    static async name(property_code){
        let res = await db.get('vw_properties_all', ['property_name'], {property_code: property_code});
        return res.length ==1? res[0].property_name: '';
    }

    static async Available(user_code){
        let res = await db.get('vw_properties_all', ['count(property_code) as `p_count`'], {user_code: user_code});
        return res.length ==1? res[0].p_count: 0;
    }

    static async userPropertyCount(user_code){
        let res = await db.get('vw_properties_all', ['COUNT(property_code) as available'], {user_code: user_code});
        if(res.length == 1){
            return res[0].available;
        }else{
            return;
        }        
    }

    static async addImage(info){
        let res = await db.insert('tbl_property_images', info);
        return res;
    }

    static async deleteImage(image_id){
        let res = await db.delete('tbl_property_images', {image_id:image_id});
        return res;
    }

    static async owner(property_code){
        let res = await db.get('vw_properties', ['user_code'], {property_code:property_code});
        return res.length ==1? res[0].user_code: '';
    }

    static async vacantUnits(property_code){
        let res = await db.get('vw_units', ['unit_code', 'unit_name', 'floor'], {property_code:property_code, tenant_id:'null'});
        return res;
    }

    static async uploadImage(image_data, property_code) {
        var data = Buffer.from(image_data, "base64");
        var file_id = uuid.v4();
        var filename = file_id + ".jpg";
        var fl = path.join(globals.private_dir, "properties", filename);
        let created = file_helpers.createFile(data, fl);
        if (created) {
            var image_info = {
                image_id: file_id,
                property_code: property_code,
                is_default: true,
            };
            let updated = await this.addImage(image_info);
            if(!updated) {
                file_helpers.delete_file(fl);
            }
            return updated;
        } else {
            return 0;
        }
    }

    static async addMeterReading(info, clear_existing=false) {
       // console.log(info)
        if(clear_existing){
            let trans = [];
            let c = {
                sql:null, 
                data: {bill_generated:1},
                table_name:'tbl_units_meter_readings',
                method:'UPDATE',
                where_data:{unit_code:info.unit_code},
            };
            trans.push(c);  
            
            c = {
                sql:null, 
                data: info,
                table_name:'tbl_units_meter_readings',
                method:'INSERT',
                where_data:null,
            };
            trans.push(c);  

            let res = await db.transaction(trans);
            return res;           
        }else{
            let res = await db.insert('tbl_units_meter_readings', info);
            return res;
        }       
    }
}

class AgentProperties extends Table{
    static async list(manager_id){
        var ids = (manager_id.split(','));
        var id_string="";

        for(var i = 0; i < ids.length; i++){
            id_string  +=`'${ids[i]}',`;
        }

        id_string = id_string.slice(0, -1);

        let res = await db.query(`SELECT vw_properties_all.*,tbl_property_users_assigned.manage_units, tbl_property_users_assigned.manage_expenses, tbl_property_users_assigned.manage_images, tbl_property_users_assigned.manage_leases, tbl_property_users_assigned.manage_payments, tbl_property_users_assigned.manage_tenants,tbl_property_users_assigned.meter_readings FROM vw_properties_all LEFT JOIN tbl_property_users_assigned ON tbl_property_users_assigned.property_code = vw_properties_all.property_code AND tbl_property_users_assigned.manager_id in(${id_string}) WHERE vw_properties_all.property_code IN ( SELECT property_code FROM tbl_property_users_assigned WHERE manager_id in (${id_string}) ) AND ( SELECT expiry_date FROM tbl_subscriptions WHERE user_code = vw_properties_all.user_code ORDER BY expiry_date DESC LIMIT 1 ) >= DATE( NOW( ) );` );
        return res;
    }

    static async info(property_code, manager_id){
        var ids = (manager_id.split(','));
        var id_string="";

        for(var i = 0; i < ids.length; i++){
            id_string  +=`'${ids[i]}',`;
        }

        id_string = id_string.slice(0, -1);
       

        let res = await db.query(`SELECT vw_properties_all.*,tbl_property_users_assigned.manage_units,tbl_property_users_assigned.manage_expenses, tbl_property_users_assigned.manage_images, tbl_property_users_assigned.manage_leases, tbl_property_users_assigned.manage_payments, tbl_property_users_assigned.manage_tenants, tbl_property_users_assigned.meter_readings FROM vw_properties_all LEFT JOIN tbl_property_users_assigned ON tbl_property_users_assigned.property_code = vw_properties_all.property_code AND tbl_property_users_assigned.manager_id in(${id_string}) WHERE vw_properties_all.property_code IN ( SELECT property_code FROM tbl_property_users_assigned WHERE manager_id in (${id_string})) AND ( SELECT expiry_date FROM tbl_subscriptions WHERE user_code = vw_properties_all.user_code ORDER BY expiry_date DESC LIMIT 1 ) >= DATE( NOW( ) ) AND vw_properties_all.property_code = ?;`, [property_code]);      
        return res.length ==1? res[0]: null;
    }

    static async rights(property_code, manager_id){
        let res = await db.get('tbl_property_users_assigned', null, {property_code:property_code, manager_id:manager_id});       
        return res.length ==1? res[0]: {};
    }
}

class Expense extends DB{
    constructor(property_code, id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(property_code, id);
            }else{                
                this.expense_id = uuid.v4();
                this.property_code = property_code;
            }
            return this; 
         })();     
    }

    async loadExisting(property_code, expense_id){
        let res =  await this.get('vw_expenses', null,{'property_code':property_code, 'expense_id':expense_id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(entries){
        let trans = [];

        let c = {sql:"INSERT INTO tbl_expenses SET ?;", data:[this]};
        trans.push(c);
        
        c = {sql:"INSERT INTO tbl_expenses_breakdown (description, amount, expense_id)VALUES ?;", data:[entries.map((item) => [item.Particular, item.Amount, this.expense_id])]};
        trans.push(c);     

        let res = await db.transaction(trans);
        return res;       
    }
}

class Expenses extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_expenses';
    }  

    static async addPayment(info){
        let trans = [];         
        let t = {
            transaction_no:  moment().format('HHmmMMDDYYYY') + helpers.generate_random_upper(8),
            transaction_date:  moment().format(),
            amount_in: 0,
            amount_out: parseFloat(info.amount) + parseFloat(info.transaction_charge),
            completed: 1,
            target_account: info.source_account,
            posted_by: info.added_by
        };
        
        let c = {sql:"INSERT INTO tbl_expenses_payments SET ?;", data:[info]};
        trans.push(c);     

        c = {sql:"INSERT INTO tbl_transactions SET ?;", data:[t]};
        trans.push(c);

        let res = await db.transaction(trans);
        return res;
    }

    static async Cancel(expense_id){
        let res = await db.update_db('tbl_expenses',{'is_cancelled':1}, {'expense_id':expense_id} )
        return res;
    }

    static async Delete(expense_id) {
        let trans = [];        
        
        let c = {sql:"DELETE FROM tbl_expenses_breakdown WHERE expense_id = ?;", data:[expense_id]};
        trans.push(c);     

        c = {sql:"DELETE FROM tbl_expenses WHERE expense_id = ?;", data:[expense_id]};
        trans.push(c);

        let res = await db.transaction(trans);
        return res;       
    }

    static async Cancel(expense_id){
        let res = await db.update_db('tbl_expenses',{'is_cancelled':1}, {'expense_id':expense_id} )
        return res;
    }

    static async payments(expense_id){
        let res = await db.get('tbl_expenses_payments', null, {expense_id: expense_id});
        return res || [];
    }

    static async items(expense_id){
        let res = await db.get('tbl_expenses_breakdown', null, {expense_id: expense_id});
        return res || [];
    }

    static async Update(information, unit_code, property_code) {
        let res = await db.query("UPDATE tbl_units SET ? WHERE unit_code = ? AND property_code = ?;", [information, unit_code, property_code]);
        return res;
    }
}

class Managers extends Table{
   
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_property_users';
    }  

    static async add(info){
        let res = await db.insert('tbl_property_users', info);
        return res;
    }

    static async available(user_code){
        let res = await db.get('tbl_property_users', ['COUNT(manager_id) as available'], {user_code: user_code});
        return res.length == 1? res[0].available : 0;
    }

    static async emailAvailable(user_code, email_address){
        let res = await db.get('tbl_property_users', ['COUNT(manager_id) as available'], {user_code: user_code, email_address:email_address});
        return res.length == 1? res[0].available : 0;
    }

    static async info(user_code, manager_id){
        let res = await db.get('tbl_property_users', null, {user_code: user_code, manager_id:manager_id});
        return res.length == 1? res[0]: null;
    }

    static async delete(user_code, manager_id){
        let res = await db.delete('tbl_property_users',{user_code: user_code, manager_id:manager_id});
        return res;
    }

    static async activate(user_code, manager_id, account_active){
        let res = await db.update_db('tbl_property_users',{account_active:account_active}, {user_code: user_code, manager_id:manager_id});
        return res;
    }

    static async isEmailOwner(manager_id, email_address){
        let res = await db.query('select 1 from tbl_property_users where email_address = ? and manager_id !=?', [email_address, manager_id]);
        return res.length > 0? 0 : 1;
    }

    static async update(user_code, info, manager_id) {
        let res = await db.update_db('tbl_property_users',info, {user_code: user_code, manager_id:manager_id});
        return res;
    }

    static async unassigned(manager_id, user_code){
        let res = await db.query('SELECT property_code, property_name FROM vw_properties WHERE property_code NOT IN ( SELECT property_code FROM tbl_property_users_assigned WHERE manager_id =? ) AND user_code =?;', [manager_id, user_code]);
        return res|| [];
    }

    static async assign(obj){
        let res = await db.insert('tbl_property_users_assigned',obj);
        return res;
    }

    static async remove(property_code, manager_id){
        let res = await db.delete('tbl_property_users_assigned',{property_code:property_code, manager_id:manager_id});
        return res;
    }

    static async rights(property_code, manager_id){
        let res = await db.get('tbl_property_users_assigned', null,{property_code:property_code, manager_id:manager_id});
        return res.length == 1? res[0]: null;
    }

    static async update_rights(obj, where_data){
        let res = await db.update_db('tbl_property_users_assigned', obj,where_data);
        return res;
    }
    
}

class Payables extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_ac_payables';
    }  

    static async unpaidTotal(property_code){
        let res = await db.query("SELECT IFNULL(SUM(vw_ac_payables.balance),0) as balance FROM vw_ac_payables WHERE property_code =?;", [property_code]);       
        return res.length==1 ? res[0].balance :0;
    }
}

class AccountsList extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_accounts_list';
    }     

    static async add(raw_data) {
        let res = await db.insert('tbl_acounts_list', raw_data);
        return res;
    }

    static async update(info, account_id) {
        let res = await db.update_db('tbl_acounts_list', info, {account_id:account_id})
        return res;
    }

    static async delete(account_id) {
        let res = await db.delete('tbl_acounts_list', {account_id:account_id});
        return res;
    }

    static async get(account_id) {
        let res = await db.get('tbl_acounts_list',['*'], {account_id:account_id});
        return res.length==1? res[0]: {};
    }

    static async list(user_code) {
        let res = await db.get('tbl_acounts_list',['account_id','account_no','account_name','payment_instructions'], {is_Active:1, user_code:user_code});
        return res;
    }
}

class Works extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_work_orders';
    }  

    static async Update(info, id) {
        let res = await db.update_db('tbl_work_orders', info, {id:id});
        return res;
    }

    static async updateProgress(info) {
        let res = await db.insert('tbl_work_order_progress', info);
        return res;
    }

    static async Get(id) {
        let res = await db.get('tbl_work_orders',['*'], {id:id});
        return res.length==1? res[0]: {};
    }

    static async getAvailableCount(user_code) {
        let res = await db.get('tbl_work_orders',['COUNT(*) AS available_managers'], {user_code:user_code});
        
        if(res.length >0){
            return res[0].available_managers;
        }else{
            return 0;
        }
    }

    static async getAll(user_code) {
        let res = await db.get('vw_work_orders',["REPLACE(description,'\n','<br>')description", "unit_code", "DATE_FORMAT(date_posted,'%d-%m-%Y %h:%i %p')date_posted", "work_origin", "work_type"," status", "priority", "tenant_id", "supplier_code", "amount", "unit_name", "floor", "property_name", "property_code", "supplier_name", "progress"], {user_code:user_code});
        return res;
    }

    
    static async Add(raw_data) {
        let res = await db.insert('tbl_work_orders', raw_data);
        return res;
    }

    static async Delete(supplier_code) {
        let res = await db.delete('tbl_work_orders', {supplier_code:supplier_code});
        return res;
    }

    static async generate_bill(id, bill, entries){
        let trans = [];

        let c = {
            method:"INSERT",
            table_name: 'tbl_expenses',
            data:bill
        };
        trans.push(c);
        
        c = {sql:"INSERT INTO tbl_expenses_breakdown (description, amount, expense_id)VALUES ?;", data:[entries.map((item) => [item.Particular, item.Amount, bill.expense_id])]};
        trans.push(c); 
        
        c = {sql:"UPDATE tbl_work_orders SET bill_generated = 1 WHERE id = ?;", data:[id]};
        trans.push(c);

        let res = await db.transaction(trans);
        return res;       
    }
}

class Reading extends DB{
    constructor(id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(id);          
            }
            return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_units_meter_readings', null,{'reading_id':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_units_meter_readings', this);
        return res;
    }

    async update(){
        let res =  await this.replace('tbl_units_meter_readings', this);
        return res;
    }
}

class Readings extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_units_meter_readings';
    }  

    static async lastSingle(unit_code){
        let res = await db.get('vw_units_last_meter_readings',['reading_type', 'read_value'], {unit_code:unit_code});
        return res;
    }

    static async intitializeMeter(meter_name,user_code, meter_rate, property_code ){
        let sql = "INSERT INTO tbl_units_meter_readings ( unit_code, reading_type, read_value, units_used, read_date, read_by, unit_rate, bill_generated ) SELECT tbl_units.unit_code, ?, 0, 0, now( ), ?, ?, 1 FROM tbl_units WHERE CONCAT( tbl_units.unit_code, ? ) NOT IN ( SELECT CONCAT( tbl_units_meter_readings.unit_code, tbl_units_meter_readings.reading_type ) FROM tbl_units_meter_readings) AND tbl_units.property_code = ?;";      
        let res = await db.query(sql, [meter_name, user_code, meter_rate, meter_name, property_code]);       
        return res;
    }
}

class LastReadings extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_units_last_meter_readings';
    }  
}

class AccountTransactions extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'view_account_transactions';
    }    
}

module.exports = {AccountTransactions,Property, Properties, Expense, Expenses, Managers, Works, Reading, Readings, LastReadings, Payables, AccountsList, AgentProperties};