const db = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');
const uuid = require('uuid');
const moment = require('moment');

class Unit extends DB{
    constructor(property_code, id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(property_code, id);
            }else{              
                this.unit_code = uuid.v4();
                this.property_code = property_code;
            }
            return this; 
         })();     
    }

    async loadExisting(property_code, id){
        let res =  await this.get('vw_units',null,{'unit_code':id, property_code:property_code}); 
        if(res.length == 1){
            let data = res[0]; 
            Object.assign(this, data); 
        }
    }

    async save(rent_amount){
        let res =  await this.insert('tbl_units', this);
        if(res){
            var rnt = {
                unit_code: this.unit_code,
                rent_amount: rent_amount,
                effective_from: moment().format(),
            };
            Units.addRent(rnt);
        }
        return res;
    }    

    async update(){          
        let data = Object.assign({}, this);       
        delete data['image_id'];
        delete data['rent_amount'];
        delete data['effective_from'];
        delete data['tenant_id'];
        delete data['tenant_name'];
        delete data['occupied'];  
        delete data['unit_code'];  
        delete data['ad_id'];       
        delete data['average_rating'];
        let res =  await this.update_db('tbl_units', data, {unit_code: this.unit_code});
        return res;
    }

    async delete(){      
        let trans = [];

        let c = {sql:"DELETE FROM tbl_unit_rents WHERE unit_code=?;", data:[this.unit_code]};
        trans.push(c);
        
        c = {sql:"DELETE FROM tbl_units_ratings WHERE unit_code=?;", data:[this.unit_code]};
        trans.push(c); 

        c = {sql:"DELETE FROM tbl_units_images WHERE unit_code=?;", data:[this.unit_code]};
        trans.push(c); 

        c = {sql:"DELETE FROM tbl_units WHERE unit_code = ?;", data:[this.unit_code]};
        trans.push(c); 

        let res = await db.transaction(trans);
        return res;
    } 
}

class Units extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_units_brief';
    }   
    
    static async clone(property_code, unit_code, unit_name){
        let data = await this.fullInfo(property_code, unit_code);
        if(data){
            let new_unit = await new Unit(property_code);           
            let rent_amount = data.rent_amount;
            delete data['image_id'];
            delete data['rent_amount'];
            delete data['effective_from'];
            delete data['tenant_id'];
            delete data['tenant_name'];
            delete data['occupied'];  
            delete data['unit_code'];  
            delete data['ad_id'];       
            delete data['average_rating'];
            delete data['unit_images'];
            delete data['unit_ratings'];
            
            Object.assign(new_unit, data);
            new_unit.unit_name = unit_name;
            let s = await new_unit.save(rent_amount);
            return s;
        }else{
            return 0;
        }
    }

    static async brief(property_code){
        let res = await db.get('vw_units_brief', ['unit_code', 'unit_name', 'floor'], {property_code:property_code})
        return res;
    }

    static async fullInfo(property_code, unit_code){
        let res = await db.get('vw_units_full', ['*'], {property_code:property_code, unit_code: unit_code});
        return res.length == 1 ? res[0] :[];
    }

    static async available(user_code){
        let res = await db.get('vw_units_count', ['available_units'], {user_code: user_code});
        return res.length > 0 ? res[0].available_units : 0;
    }

    static async addRent(info){
        let res =  await db.insert('tbl_unit_rents', info);
        return res;
    }
    
    static async unitValues(property_code, unit_code){
        let res = await db.get('vw_units_values', ['*'], {property_code:property_code, unit_code: unit_code});
        return res.length == 1 ? res[0] :[];
    }

    static async images(unit_code) {
        let res = await db.get('tbl_units_images', ['image_id', 'image_description', 'is_default'], {unit_code:unit_code, is_default:0})
        return res;
    }

    static async allImages(unit_code) {
        let res = await db.get('tbl_units_images', ['image_id'], {unit_code:unit_code})
        return res;
    }

    static async displayImage(unit_code){      
        let res = await db.get('vw_units', ['image_id', 'unit_name'], {unit_code:unit_code});       
        return res.length ==1 ? res[0] : [];
    }

    static async addImage(image_info) {
        let res = await db.insert('tbl_units_images', image_info);
        return res;
    }

    static async deleteImage(image_id) {
        let res = await db.delete('tbl_units_images',{image_id:image_id});
        return res;
    }

    static async reviews(unit_code, from){
        let res = await db.query('SELECT * FROM vw_units_ratings where unit_code = ? AND  rating_id > ? LIMIT 6', [unit_code, from])
        return res|| [];
    }    

    static async newReview(data){
        let res = await db.insert('tbl_units_ratings',data);
        return res;
    }

    static async currentTenant(unit_code) {
        let res = await db.get('vw_active_leases',['tenant_id', 'tenant_name'], {unit_code:unit_code});
        return res.length ==1 ? res[0] :null;
    }  

    static async activeLease(unit_code) {
        let res = await db.get('vw_active_leases',null, {unit_code:unit_code});
        return res.length ==1 ? res[0] :{};        
    }

    static async activeLeases(){
        let res = await db.get('vw_active_leases',null);
        return res || []; 
    }
    
    static async getReadingHistory(unit_code){
        let res = await db.get('vw_units_meter_readings',['*'], {unit_code:unit_code});
        return res || null;
    }

    static async getSingleLastMeterReading(unit_code, reading_type, last_date){       
        let res = await db.query('SELECT * FROM tbl_units_meter_readings WHERE unit_code=? AND reading_type=? AND DATE(read_date) < DATE(?) ORDER BY DATE(read_date) DESC LIMIT 1;', [unit_code, reading_type, last_date]);      
        return res.length ==1? res[0]: {};
    }   

    static async getSingleFull(unit_code) {
        let res = await db.query("SELECT unit_code, unit_name, property_code, floor, garages, bedrooms, bathrooms, payment_day, unit_type, electricity_type, water_source, furnishing, payments_plan, internet_available, tv_cable_available, has_balcony, has_garden, has_closet, has_laundry_room,pet_friendly, active_to_rent,floor_type,  unit_deposits, unit_fixed_bills, unit_variable_bills, rent_amount, DATE_FORMAT( effective_from, '%Y-%m-%d' ) effective_from, tenant_id, tenant_name, occupied, ( SELECT concat( '[', ifnull( group_concat( json_object ( 'image_id', `image_id`, 'image_description', `image_description`, 'is_default',`is_default` ) SEPARATOR ',' ), '' ), ']' ) FROM `tbl_units_images` WHERE tbl_units_images.unit_code = vw_units.unit_code ORDER BY date_add DESC ) AS unit_images , (SELECT concat( '[', json_object ( 'average_rating', ROUND(IFNULL( SUM( user_rating ), 0 ) / COUNT( user_rating ),0), 'ratings_count', COUNT( user_rating ) ), ']' ) FROM tbl_units_ratings WHERE rating_approved = 1 AND tbl_units_ratings.unit_code = vw_units.unit_code ) AS unit_ratings FROM vw_units WHERE unit_code =?;", [unit_code]);
        return res.length ==1? res[0]: {};
    }

    static async getLeasePayentsHistory(lease_id) {
        let res = await db.query("SELECT tbl_tenant_bills_payments.payment_id, tbl_tenant_bills.bill_id, DATE_FORMAT( payment_date, '%d-%m-%Y' ) AS payment_date, tbl_tenant_bills_payments.payment_method, tbl_tenant_bills_payments.payment_amount, tbl_tenant_bills_payments.payment_ref, tbl_tenant_bills_payments.payment_by, tbl_tenant_bills_payments.manually_entered, tbl_tenant_bills_payments.is_cancelled, tbl_tenant_bills_payments.cancel_reasons, tbl_tenant_bills.bill_code FROM tbl_tenant_bills_payments LEFT JOIN tbl_tenant_bills ON tbl_tenant_bills_payments.bill_id = tbl_tenant_bills.bill_id WHERE tbl_tenant_bills.lease_id =? ORDER BY payment_date DESC;", [lease_id]);
        return res;
    }

    static async unbilledMeterBills(unit_code){
        let res = await db.query("SELECT reading_type, SUM( IFNULL( units_used * unit_rate, 0 ) ) bill_amount FROM tbl_units_meter_readings WHERE bill_generated = 0 AND unit_code = ? GROUP BY reading_type;", [unit_code]);
        return res || [];
    }
}

class Advert extends DB{
    constructor(id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(id);
            }else{              
                this.ad_id = uuid.v4();  
                this.ad_date =  moment().format();           
            }
            return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_ads',null,{'ad_id':id}); 
        if(res.length == 1){
            let data = res[0]; 
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_ads', this);       
        return res;
    }    

    async update(){          
        let data = {viewing_fees: this.viewing_fees, ad_comments: this.ad_comments};
        let res =  await this.update_db('tbl_ads', data, {ad_id: this.ad_id});
        return res;
    }

    static async end(ad_id){
        let res =  await db.delete('tbl_ads', {ad_id: ad_id});
        return res;
    }

    static async info(ad_id) {
        let res = await db.get('vw_ads', null, {ad_id: ad_id});
        return res.length == 1? res[0] : null;
    }
}

class Lease extends DB{
    constructor(id=null){
        super();
        return (async () => {
            if(id){  
              await this.loadExisting(id);
            }else{              
                this.lease_id = uuid.v4();               
            }
            return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_units_leases',null,{'lease_id':id}); 
        if(res.length == 1){
            let data = res[0]; 
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_units_leases', this);       
        return res;
    }    

    async update(){          
        let data = Object.assign({}, this);        
        delete data['lease_id'];     
        let res =  await this.update_db('tbl_units_leases', data, {lease_id: this.lease_id});
        return res;
    }
}

class Leases extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_leases';
    }    

    static async single(property_code, lease_id){
        let res = await db.get('vw_leases', null, {property_code: property_code, lease_id: lease_id});
        return res.length == 1? res[0] : null;
    }
}

class RentHistory extends Table{    
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_units_rent_history';
    }    
}

class PaymentsHistory extends Table{    
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_tenant_payments';
    }    
}

class InvoicesHistory extends Table{    
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_units_invoices_history';
    }    
}

class UpcomingLeases extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_leases_upcoming';
    }    
}

module.exports = {Unit, Units, Advert, Lease, Leases, RentHistory, PaymentsHistory, InvoicesHistory, UpcomingLeases};