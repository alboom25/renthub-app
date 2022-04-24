const sql = require('../db/db.queries');
const DB = require('../db/main');
const Table = require('../db/table.data');

class Location extends DB{

}

class Locations extends Table{
    static async counties() {
        let res = await sql.get('tbl_counties', ['county_id', 'county_name']);
        return res;
    }

    static async constituencies(county_id) {
        let res = await sql.get("tbl_constituencies", ['constituency_id AS id', 'constituency_name AS name'], {county_id:county_id});
        return res;       
    }

    static async localities(constituency_id) {
        let res = await sql.get("tbl_localities",['locality_id AS id', 'locality_name AS name'], {constituency_id:constituency_id});
        return res;         
    }
}

module.exports = {Location, Locations}