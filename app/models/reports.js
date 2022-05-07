const sql = require('../db/db.queries');

class AdminReports{
    static async tenants(property_code){
        let res = await sql.query("SELECT CONCAT( first_name, ' ', last_name ) 'Tenant Name',	id_number AS 'ID Number',	date_of_birth AS 'D.O.B', gender AS 'Gender', phone_number AS 'Phone No',	alt_phone_number AS 'Phone No 2',	nationality AS 'Nationality', created_on AS 'Added On' FROM vw_tenants WHERE property_code =? ORDER BY DATE(created_on) DESC;", [property_code]);      
        return res;
    }

    static async active_tenants(property_code){
        let res = await sql.query("SELECT CONCAT( first_name, ' ', last_name ) 'Tenant Name',	id_number AS 'ID Number',	date_of_birth AS 'D.O.B', gender AS 'Gender', phone_number AS 'Phone No',	alt_phone_number AS 'Phone No 2',	nationality AS 'Nationality', created_on AS 'Added On',	vw_tenants.units AS 'Rented Units' FROM vw_tenants WHERE property_code =? and vw_tenants.units IS NOT NULL ORDER BY DATE(created_on) DESC;", [property_code]);      
        return res;
    }

    static async all_units(property_code){
        let res = await sql.query("SELECT vw_units.unit_name AS 'Unit #', vw_units.unit_type 'TYPE', vw_units.floor 'FLOOR', vw_units.rent_amount 'MONTHLY RENT', vw_units.floor_type 'FLOOR TYPE', vw_units.furnishing 'FURNISHING', vw_units.bedrooms 'BEDROOMS' FROM vw_units where property_code=? ORDER BY vw_units.unit_name;", [property_code]);      
        return res;
    }

    static async occupied_units(property_code){
        let res = await sql.query("SELECT vw_units.unit_name AS `Unit #`, vw_units.unit_type AS TYPE, vw_units.floor AS FLOOR, vw_units.rent_amount AS `MONTHLY RENT`, vw_units.floor_type AS `FLOOR TYPE`, vw_units.furnishing AS FURNISHING, vw_units.tenant_name AS `TENANT NAME` FROM vw_units WHERE vw_units.tenant_id IS NOT NULL AND property_code=? ORDER BY vw_units.unit_name;", [property_code]);      
        return res;
    }

    static async unoccupied_units(property_code){
        let res = await sql.query("SELECT vw_units.unit_name AS `Unit #`, vw_units.unit_type AS TYPE, vw_units.floor AS FLOOR, vw_units.rent_amount AS `MONTHLY RENT`, vw_units.floor_type AS `FLOOR TYPE`, vw_units.furnishing AS FURNISHING FROM vw_units WHERE vw_units.tenant_id IS NULL AND property_code =? ORDER BY vw_units.unit_name;", [property_code]);      
        return res;
    }

    static async active_leases(property_code){
        let res = await sql.query("SELECT unit_name 'UNIT #', unit_type 'UNIT TYPE', lease_date 'LEASE DATE', expiry_date 'EXPIRY DATE', monthly_rent 'MONTHLY RENT', bills_payment_date 'BILLS DATE', tenant_name 'TENANT NAME' FROM vw_active_leases WHERE property_code=? ORDER BY lease_date DESC;", [property_code]);      
        return res;
    }

    static async expired_leases(property_code,date_from,date_to){
        let res = await sql.query("SELECT unit_name 'UNIT #', unit_type 'UNIT TYPE', lease_date 'LEASE DATE', expiry_date 'EXPIRY DATE', monthly_rent 'MONTHLY RENT', bills_payment_date 'BILLS DATE', tenant_name 'TENANT NAME' FROM vw_leases where is_active = 0 AND (lease_date BETWEEN ? AND ? ) OR (expiry_date BETWEEN ? AND ?) AND property_code = ? ORDER BY lease_date DESC;", [date_from, date_to,date_from, date_to, property_code]);      
        return res;
    }

    static async meter_readings(property_code){
        let res = await sql.query("SELECT unit_name 'UNIT #', unit_type 'TYPE', floor 'FLOOR', reading_type 'METER TYPE', read_value 'LAST VALUE', read_date 'DATE READ' FROM vw_units_last_meter_readings WHERE property_code = ? ORDER BY read_date DESC", [property_code]);      
        return res;
    }

    static async work_orders(property_code,date_from,date_to){
        let res = await sql.query("SELECT work_type 'WORK TYPE', description 'DESCRIPTION', DATE_FORMAT( date_posted, '%d-%m-%Y' ) 'POSTED ON', priority 'PRIORITY', `status` 'STATUS', unit_name 'UNIT #', floor 'FLOOR' FROM vw_work_orders WHERE property_code =? AND (DATE(date_posted) BETWEEN ? AND ?) ORDER BY date_posted DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

    static async all_suppliers(user_code){
        let res = await sql.query("SELECT full_name 'SUPPLIER NAME', supplier_type 'TYPE', phone_number 'PHONE NUMBER', DATE_FORMAT(added_on,'%d-%m-%Y') 'DATE ADDED', FORMAT(pending_amount,'2') 'UNPAID BALANCE' FROM vw_suppliers where user_code = ? order by full_name;", [user_code]);      
        return res;
    }

    static async accounts_list(user_code){
        let res = await sql.query("SELECT account_no 'A/C #', account_name 'A/C NAME', bank_name 'BANK', branch_name 'BRANCH', account_type 'TYPE', FORMAT( expected_balance, '2' ) 'EXP. BAL' FROM vw_accounts_list WHERE user_code = ? ORDER BY account_name;", [user_code]);      
        return res;
    }

    static async expenses_list(property_code,date_from,date_to){
        let res = await sql.query("SELECT DATE_FORMAT( created_on, '%d-%m-%Y' ) 'EXPENSE DATE', expense_title 'TITLE', expense_description 'DESCRIPTION', unit_name 'UNIT #', FORMAT( expense_amount, '2' ) 'AMOUNT', FORMAT( expense_amount - paid_amount, '2' ) 'BALANCE' FROM vw_expenses WHERE property_code =? AND is_cancelled = 0 AND(DATE(created_on) BETWEEN ? AND ?) ORDER BY created_on DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

    static async tenant_invoices(property_code,date_from,date_to){
        let res = await sql.query("SELECT bill_code 'BILL #', DATE_FORMAT( bill_date, '%d-%m-%Y' ) 'BILL DATE', tenant_name 'TENANT NAME', unit_name 'UNIT #', FORMAT(total_amount,'2') 'BILL AMOUNT', FORMAT(total_amount-paid_amount,'2') 'BALANCE' FROM vw_tenant_invoices  WHERE property_code =? AND is_cancelled = 0 AND(DATE(bill_date) BETWEEN ? AND ?) ORDER BY bill_date DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

    static async tenant_payments(property_code,date_from,date_to){
        let res = await sql.query("SELECT payment_date 'DATE', payment_method 'METHOD', FORMAT( payment_amount, '2' ) 'AMOUNT', payment_ref 'REFERENCE', payment_by ' PAID BY', bill_code 'BILL #', unit_name 'UNIT #', is_cancelled FROM vw_tenant_payments  WHERE property_code =? AND is_cancelled = 0 AND(DATE(raw_payment_date) BETWEEN ? AND ?) ORDER BY raw_payment_date DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

    static async supplier_invoices(property_code,date_from,date_to){
        let res = await sql.query("SELECT IFNULL(supplier_name,'N/A') 'SUPPLIER NAME', DATE_FORMAT( created_on, '%d-%m-%Y' ) 'BILL DATE', expense_title 'TITLE', expense_description 'DESCRIPTION', FORMAT( expense_amount, '2' ) 'BILL AMOUNT', FORMAT( expense_amount - paid_amount, '2' ) 'BALANCE' FROM vw_supplier_invoices  WHERE property_code =? AND is_cancelled = 0 AND(DATE(created_on) BETWEEN ? AND ?) ORDER BY supplier_name DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

    static async supplier_payments(property_code,date_from,date_to){
        let res = await sql.query("SELECT IFNULL(supplier_name,'N/A') 'SUPPLIER NAME',  payment_date 'DATE/TIME', payment_method 'METHOD', FORMAT( amount, '2' ) 'AMOUNT', reference 'REFERENCE', source_account_name 'SOURCE ACCOUNT' FROM vw_expense_payments  WHERE property_code =? AND is_cancelled = 0 AND(DATE(raw_payment_date) BETWEEN ? AND ?) ORDER BY raw_payment_date DESC;", [property_code,date_from, date_to,]);      
        return res;
    }

}

module.exports = {AdminReports};