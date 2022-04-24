const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');

class Supplier extends DB{
  
}

class Suppliers extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_suppliers';
    }   
    
    static async info(supplier_code, user_code){
        let res = await sql.get('tbl_suppliers',null, {supplier_code:supplier_code, user_code:user_code});
        return res.length == 1? res[0] : null;
    }

    static async emailRegistered(email_address){
        let res = await sql.get('tbl_suppliers', ['COUNT(supplier_code) as available'], {email_address:email_address});
        return res.length == 1? 'true' : 'false';
    }

    static async add(data){
        let res =  await sql.insert('tbl_suppliers', data);
        return res;
    }

    static async getList(user_code){
        let res = await sql.get('tbl_suppliers', ['supplier_code', "CONCAT( first_name, ' ', last_name ) full_name"], { user_code:user_code});
        return res;
    }

    static async Delete(supplier_code) {
        let res = await sql.delete('tbl_suppliers', {supplier_code:supplier_code});
        return res;
    }

    static async emailAssigned(email, supplier_code) {
        let res = await sql.query('select 1 from tbl_suppliers where email_address = ? and supplier_code !=?', [email,supplier_code ]);
        return res.length > 0;        
    }

    static async Get(supplier_code) {
        let res = await sql.get('tbl_suppliers', ['supplier_code', 'supplier_type', 'first_name', 'last_name', 'email_address', 'phone_number', 'supplier_type', '0 as balance'], {supplier_code:supplier_code});
        return res.length == 1? res[0] : {};
    }

    static async Update(info, supplier_code) {
        let res = await sql.update_db('tbl_suppliers', info, {supplier_code:supplier_code});
        return res;
    }
}

class Bill extends DB{

}

class Bills extends Table{
    
}


class Payment extends DB{

}

class Payments extends Table{
    
}

class Invoices extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_supplier_invoices';
    }  
}

class ExpensesPayments extends Table{
    constructor(){
        super();
        this.columns = ['*'];
        this.table_name = 'vw_expense_payments';
    }  
}


module.exports = {Supplier, Suppliers, Bill, Bills, Payments, Payment, Invoices, ExpensesPayments}