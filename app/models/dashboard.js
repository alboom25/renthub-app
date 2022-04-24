const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');

class Tenant{

}

class Admin{
    static async getNumbers(user_code) {
        let res = await sql.query("SELECT FORMAT( a.revenue, '2' ) revenue, FORMAT( a.expenses, '2' ) expenses, FORMAT( a.unpaid_bills, '2' ) unpaid_bills, FORMAT( b.active_tenants, '0' ) active_tenants, DATE_FORMAT( Now( ), '%M' ) month_name, YEAR(NOW()) current_year FROM ( SELECT SUM( income ) AS revenue, SUM( expenses ) AS expenses, SUM( 0 ) AS unpaid_bills FROM vw_properties_all WHERE vw_properties_all.user_code =? ) a, ( SELECT COUNT( lease_id ) active_tenants FROM vw_active_leases LEFT JOIN tbl_properties ON vw_active_leases.property_code = tbl_properties.property_code WHERE tbl_properties.user_code =? ) b;",[user_code, user_code]);
        return res.length ==1? res[0]:{};     
    }

    static async bestUnits(user_code) {
        let res = await sql.query("SELECT unit_name, FORMAT(SUM( total_amount ),'2') AS revenue, vw_tenant_invoices.property_name FROM vw_tenant_invoices LEFT JOIN tbl_properties ON vw_tenant_invoices.property_code = tbl_properties.property_code WHERE is_cancelled = 0 AND bill_year = YEAR ( NOW( ) ) AND paid_amount >= total_amount AND tbl_properties.user_code =? GROUP BY unit_code ORDER BY SUM( total_amount ) DESC LIMIT 5", [user_code]);
        return res;    
    }

    static async revenueGraph(user_code, result) {
        let res = await sql.query("SELECT MONTHNAME( STR_TO_DATE( tbl_months.month_val, '%m' ) ) month_name, IFNULL( b.revenue, 0 ) revenue FROM tbl_months LEFT JOIN ( SELECT MONTH ( payment_date ) month_val, ifnull( sum( `paid_amount` ), 0 ) revenue FROM `vw_daily_property_income` LEFT JOIN tbl_properties ON vw_daily_property_income.property_code = tbl_properties.property_code WHERE YEAR ( `payment_date` ) = YEAR ( curdate( ) ) AND tbl_properties.user_code =? GROUP BY YEAR ( `payment_date` ), MONTH ( `payment_date` ) ) AS b ON b.month_val = tbl_months.month_val WHERE tbl_months.month_val <= MONTH ( NOW( ) );", [user_code]);
        return res;    
    }

    static async unitsData(user_code) {
        let res = await sql.query("SELECT COUNT( vw_active_leases.unit_code ) leased_units, tbl_units.unit_type FROM vw_active_leases LEFT JOIN tbl_units ON vw_active_leases.unit_code = tbl_units.unit_code LEFT JOIN tbl_properties ON tbl_units.property_code = tbl_properties.property_code WHERE tbl_properties.user_code =? GROUP BY tbl_units.unit_type;", [user_code]);
        return res;    
    }
}

module.exports = {Tenant, Admin}