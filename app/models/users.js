const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');
const uuid = require("uuid");
const helpers = require("../helpers/assorted.helpers");

class Notification extends DB{
    constructor(id){
        super();
        return (async () => {
            await this.loadExisting(id);
            return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_user_notifications', null,{'note_id':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }
}

class Notifications extends Table {
    static async Add(obj){
        let res = sql.insert('tbl_user_notifications', obj);
        return res;
    }

    static async load(user_code, last_note){
        let res = await sql.query("SELECT * FROM tbl_user_notifications WHERE user_code = ? AND note_id < ? ORDER BY note_id DESC LIMIT 5;", [user_code, last_note]);
        return res || [];
    }

    static async get(user_code){
        let res = await sql.query("SELECT * FROM tbl_user_notifications WHERE user_code = ? ORDER BY note_id DESC LIMIT 10;", [user_code]);
        return res || [];
    }

    static async new(user_code, last_note){
        let res = await sql.query("SELECT * FROM tbl_user_notifications WHERE user_code = ? AND note_id > ? ORDER BY note_id ASC LIMIT 5;", [user_code, last_note]);
        return res || [];
    }

    static async readAll(user_code){
        let res = await sql.update_db('tbl_user_notifications', {note_read: 1}, {user_code: user_code});
        return res;
    }

    static async read(note_id, user_code){
        let res = await sql.update_db('tbl_user_notifications', {note_read: 1}, {note_id: note_id, user_code:user_code});
        return res;
    }

    static async delete_entry(note_id, user_code){
        let res = await sql.delete('tbl_user_notifications', {note_id: note_id, user_code:user_code});
        return res;
    }

    static async unread(user_code){
        let res = await sql.get('tbl_user_notifications', ['COUNT(note_read) unread_notes'],{user_code:user_code, note_read:0});
        return res.length == 1 ? res[0].unread_notes:0;
    }
}

class User extends DB{
    constructor(id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(id);
            }else{
              this.user_code = uuid.v4();
            }
             return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('vw_users', null,{'user_code':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_users', this);
        return res;
    }

    async update(){
        let data = Object.assign({}, this);
        delete data['user_code'];
        delete data['is_agent'];
        delete data['manager_id'];
        let res =  await this.update_db('tbl_users', data, {user_code: this.user_code});
        return res;
    }
}

class Users extends Table {
    constructor() {}

    static async agent_properties(user_code){
        let res = await sql.get('tbl_users', ['property_code'], {email_address:email_address});
        return res.length > 0 ? res[0].user_code: null;
    }

    static async get_single(username){
        let res = await sql.query("SELECT user_code FROM tbl_users WHERE email_address = ? OR username = ? OR (phone_number = ? AND phone_number IS NOT NULL AND phone_verified = 1);", [username, username, username]);       
        return res.length == 1 ? res[0].user_code: null;  
    }

    static async registerUserLogin(info){
        let res = await sql.insert('tbl_user_logins', info);
        return res;
    }

    static async emailRegistered(email_address){
        let res = await sql.get('tbl_users', ['user_code'], {email_address:email_address});
        return res.length > 0 ? 'false': 'true';
    }

    static async emailOwner(email_address){
        let res = await sql.get('tbl_users', ['user_code'], {email_address:email_address});
        return res.length > 0 ? res[0].user_code: null;
    }

    static async resetKeyEmail(e){
        let res = await sql.get('tbl_users', ['user_code'], {password_reset_key:e});
        return res.length > 0 ? res[0].user_code: null;
    }

    static async confirmNewAccount(code){
        let res = await sql.update_db('tbl_users', {email_verified:1, email_confirmation_code:null}, {email_confirmation_code:code, email_verified:0});
        return res;
    }

    static async userSubscription(user_code){
        let res = await sql.query("SELECT tbl_subscriptions.subscription_id, tbl_subscriptions.payment_plan, tbl_subscriptions.package_id,subscription_date, expiry_date, tbl_packages.package_name, tbl_packages.maximum_properties, tbl_packages.maximum_units, tbl_packages.free_sms_units, tbl_packages.package_rate FROM tbl_subscriptions LEFT JOIN tbl_packages ON tbl_subscriptions.package_id = tbl_packages.package_id WHERE user_code=? ORDER BY tbl_subscriptions.expiry_date DESC LIMIT 1;", [user_code]);
        return res.length==1? res[0]: null;
    }

    static async demoSubscriptionAvailable(user_code){
        let res = await sql.get(`tbl_subscriptions`,['COUNT( package_id ) = 0 AS demo_available'], {user_code: user_code});
        return res.length==1? res[0].demo_available: 0;
    }

    static async hasProperties(user_code){
        let res = await sql.get(`tbl_properties`,['COUNT( property_code ) > 0 AS has_prop'], {user_code: user_code});
        return res.length==1? res[0].has_prop: 0;
    }

    static async lastReminderTime(user_code){
        let res = await sql.get(`tbl_user_sms_reminder`,['reminder_time'], {user_code: user_code});
        return res.length==1? res[0].reminder_time: null;
    }

    static async insertLastSmsReminderTime(info){
        let res = await sql.insert('tbl_user_sms_reminder', info);
        return res;
    }

    static async deductSmsUnits(user_code, sms_units){
        let res = await sql.query("UPDATE tbl_users SET available_sms_units = available_sms_units - ? WHERE user_code = ?;", [sms_units, user_code]);
        return res;
    }

    static async lastEdit(user_code){
        let res = await sql.get('tbl_user_profile_edits', ['last_edit_time'], {user_code:user_code});
        return res.length == 1 ? res[0].last_edit_time : null;
    }

    static async updateLastEdit(user_data) {
       let res = await sql.replace('tbl_user_profile_edits', user_data);
       return res;
    }

    static async logUserNamesChange(user_data) {
       let res = await sql.insert('tbl_user_names_change_log', user_data);
       return res;
    }

    static async usernameAvailable(user_name, user_code){
        let res = await sql.query("SELECT COUNT( user_code ) AS users_count FROM tbl_users WHERE (username = ? AND username IS NOT NULL AND username !='') AND user_code !=?;", [user_name, user_code]);
        return res.length ==1 ? res[0].users_count: 1;
    }

    static async unlinkPhoneOthers(phone_number, user_code){
        let res = await sql.query("UPDATE tbl_users SET phone_verified = 0, two_fa = 0 WHERE phone_number=? and user_code !=?;", [phone_number, user_code]);
        return res;
    }

    static async closeTour(user_code){
        let res = await sql.update_db('tbl_users', {tour_prompted:1}, {user_code:user_code});
        return res;
    }

    static async landlordPrompt(user_code){
        let res = await sql.update_db('tbl_users', {landlord_prompted:1}, {user_code:user_code});
        return res;
    }   

    static async requestLandlord(data){
        let auto_landlord = 1;
        let res = await sql.insert('tbl_property_own_requests',data);
        if(auto_landlord){
            await sql.update_db('tbl_users', {is_landlord:1}, {user_code:data.user_code});
        }
        return res;
    }

    static async landlordRequests(user_code){
        let res = await sql.get('tbl_property_own_requests', ['request_id'], {user_code:user_code, approved:0});
        return res.length ==1? 1:0;
    }

    static async isAgent(email_address){
        let res = await sql.query('SELECT count(1)=1 as is_agent FROM tbl_property_users WHERE email_address = ? AND account_active = 1 AND ( SELECT count( 1 ) AS props FROM vw_properties_all WHERE property_code IN ( SELECT property_code FROM tbl_property_users_assigned WHERE manager_id = tbl_property_users.manager_id ) AND ( SELECT expiry_date FROM tbl_subscriptions WHERE user_code = vw_properties_all.user_code ORDER BY expiry_date DESC LIMIT 1 ) >= DATE( NOW( ) ) ) >0', [email_address]);      
        return res[0].is_agent;
    }
}

class Subscription extends DB{

    constructor(id=null){
        super();
        return (async () => {
            if(id){
              await this.loadExisting(id);
            }else{
                this.subscription_id = uuid.v4();
            }
             return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_subscriptions', null,{'subscription_id':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(sms_units){      
        let trans = [];  
        let c = {
            method: 'INSERT',
            table_name:'tbl_subscriptions',
            data: this                      
        };
        trans.push(c);       

        c = {           
            sql:'UPDATE tbl_users SET available_sms_units = available_sms_units + ? WHERE user_code = ?;',
            data: [sms_units,this.user_code ]                     
        };
        trans.push(c);
       
        let res = await sql.transaction(trans);      
        return res;  
    }

    async update(){
        let res =  await this.replace('tbl_subscriptions', this);
        return res;
    }
}

class Subscriptions extends Table{
    constructor(){
        super();
        this.columns = ['package_name', 'subscription_date', 'expiry_date', 'is_active'];
        this.table_name = 'vw_user_subscriptions';
    }  
}

class Invoice extends DB{
    constructor(user_code, id=null){
        super();
        return (async () => {
            if(id){
              await this.loadExisting(user_code, id);
            }else{               
                this.invoice_id = helpers.generate_random_upper(10);  
                this.user_code = user_code;              
            }
             return this; 
         })();     
    }

    async loadExisting(user_code, id){
        let res =  await this.get('vw_invoices', null,{'invoice_id':id, user_code:user_code}); 
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(){
        let data = Object.assign({}, this);  
        delete data['paid_amount'];
        let res =  await this.insert('tbl_invoices', data);
        return res;
    }

    async update(){
        let data = Object.assign({}, this);  
        delete data['paid_amount'];
        let res =  await this.replace('tbl_invoices', data);
        return res;
    }   

    async payments(){
        let res = sql.query("SELECT FORMAT(paid_amount,2)paid_amount, payment_method, DATE_FORMAT(payment_date,'%d-%m-%Y %h:%i %p')payment_date, paid_by, payment_ref FROM tbl_invoice_payments WHERE invoice_id = ?;", [this.invoice_id]);
        return res;
    }
}

class Invoices extends Table{    
    constructor(){
        super();
        this.columns = ['invoice_id', 'invoice_date', 'invoice_due_date', 'invoice_amount', 'paid_amount'];
        this.table_name = 'vw_invoices';
    }  

    static async delete(id){
        let res = await sql.delete('tbl_invoices', {invoice_id:id});
        return res;
    }    
}

module.exports = {Users, User, Subscription, Subscriptions, Invoice, Invoices, Notifications, Notification};