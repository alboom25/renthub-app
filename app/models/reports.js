const sql = require('../db/db.queries');

class AdminReports{
    static async tenants(property_code){
        let res = await sql.query("SELECT CONCAT( first_name, ' ', last_name ) 'Tenant Name',	id_number AS 'ID Number',	date_of_birth AS 'D.O.B', gender AS 'Gender', phone_number AS 'Phone No',	alt_phone_number AS 'Phone No 2',	nationality AS 'Nationality', created_on AS 'Added On',	vw_tenants.units AS 'Rented Units' FROM vw_tenants WHERE property_code =? ORDER BY DATE(created_on) DESC;", [property_code]);      
        return res;
    }
}

module.exports = {AdminReports};