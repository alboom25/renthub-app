const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');
const uuid = require("uuid");


class Payment extends DB{
    constructor(id=null){
        super();
        return (async () => {
            if(id){ 
              await this.loadExisting(id);
            }else{
              this.payment_id = uuid.v4();
            }
             return this; 
         })();     
    }

    async loadExisting(id){
        let res =  await this.get('tbl_invoice_payments', null,{'payment_id':id});       
        if(res.length == 1){
            let data = res[0];
            Object.assign(this, data); 
        }
    }

    async save(){
        let res =  await this.insert('tbl_invoice_payments', this);
        return res;
    }

    async update(){
        let res =  await this.replace('tbl_invoice_payments', this);
        return res;
    }
}

class Payments extends Table {
    constructor(){
        super();
        this.columns = ['payment_date', 'paid_amount', 'payment_method', 'paid_by', 'payment_ref', 'invoice_id',];
        this.table_name = 'vw_user_payments';
    }        
}

class MpesaPayments extends Table {
    constructor(){
        super();
        this.columns = ['*',];
        this.table_name = 'tbl_mpesa_payments';
    }  

    static async get(TransID){
        let res = sql.get('tbl_mpesa_payments', null, {TransID:TransID});
        return res.length ==1? res[0]: null;
    }

    static async utilize(TransID, invoice_id, user_code){
        let pmt = sql.get('tbl_mpesa_payments', null, {TransID:TransID});
        if(pmt.length !=1) return 0;
        pmt = pmt[0];
        if(pmt.UtilizerInvoice) return 0;

        let inv =  await sql.get('vw_invoices', null,{'invoice_id':id, user_code:user_code}); 
        if(inv.length !=1) return 0;       

        var payment_obj = {
            payment_id: uuid.v4(),
            paid_amount: parseFloat(pmt.TransAmount),
            payment_method: "M-PESA",
            payment_date: pmt.TransTime,//moment().format(),
            paid_by: pmt.FirstName + ' '+ pmt.LastName + ' - ' +  pmt.MSISDN,
            payment_ref: pmt.TransID,
            invoice_id: invoice_id,
        };

        let trans = [];
        let c = {          
            data: payment_obj,
            table_name:'tbl_invoice_payments',
            method:'INSERT'
        };
        trans.push(c);  
        
        c = {         
            data: {UtilizerInvoice: invoice_id},
            table_name:'tbl_mpesa_payments',
            method:'UPDATE',
            where_data:{TransID: TransID},
        };
        trans.push(c); 
        
        if(inv.paid_amount + parseFloat(pmt.TransAmount) >= inv.invoice_amount ){
            var due_date = new Date();              
            due_date.setDate(due_date.getDate()+ 30);
            switch(inv.payment_plan){
                case 'quarterly':                   
                    due_date.setDate(due_date.getDate()+ 30 * 3);
                    break;
                case 'semi_annually':                  
                    due_date.setDate(due_date.getDate()+ 30 * 6);
                    break;
                case 'annually':                    
                    due_date.setDate(due_date.getDate()+ 30 * 12);
                    break;
            }             
            var sub_data = {   
                subscription_id: uuid.v4(),                            
                user_code: user_code,
                package_id: inv.package_id,
                payment_plan: inv.payment_plan||'monthly',
                subscription_date: moment().format(),
                expiry_date: due_date,
            };

            c = {         
                data: sub_data,
                table_name:'tbl_subscriptions',
                method:'INSERT',
            };
            trans.push(c);
        }

        let res = await db.transaction(trans);
        return res;           

    }
        
}

module.exports = {Payments, Payment, MpesaPayments};