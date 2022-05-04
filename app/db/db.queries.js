const db = require('./pool.promise');
const errors = require('../libs/logger');

exports.query = async (sql, params = null) => {
    try {
        let [res] = await db.query(sql, params);
        return res;
    } catch (e) {
        errors.log(e);
        return null;
    }
};

exports.get = async (table_name, columns = null, where_data = null, join_method = 'AND') => {
    try {
        let column_string = columns ? columns.join(', ') : '*';
        let res;
        if (where_data) {
            let where_arr = [];
            for (let key of Object.keys(where_data)) {
                let val = where_data[key];
                if (val == 'null') {
                    where_arr.push(key + ' is null');
                    delete where_data[key];
                } else if (val == 'not null') {
                    where_arr.push(key + ' is not null');
                    delete where_data[key];
                } else {
                    where_arr.push(key + ' = ?');
                }
            }
            let sql = "SELECT " + column_string + " FROM " + table_name + " WHERE " + where_arr.join(' ' + join_method + ' ');
            let temp = Object.values(where_data);

            [res] = await db.query(sql, temp);
        } else {
            [res] = await db.query("SELECT " + column_string + " FROM " + table_name);
        }
        return res;
    } catch (e) {
        errors.log(e);
        return [];
    }
};

exports.insert = async (table_name, data) => {
    try {
        let [res] = await db.query("INSERT INTO " + table_name + " SET ?;", data);
        return (res.affectedRows == 1);
    } catch (e) {
        errors.log(e);
        return 0;
    }
};

exports.replace = async (table_name, data) => {
    try {
        let [res] = await db.query("REPLACE INTO " + table_name + " SET ?;", data);
        return (res.affectedRows > 0);
    } catch (e) {
        errors.log(e);
        return 0;
    }
};

exports.update_db = async (table_name, data, where_data) => {
    try {
        let sql = "UPDATE " + table_name + " SET `" + Object.keys(data).join('` = ?, `') + "` = ? WHERE `" + Object.keys(where_data).join('` = ? AND `') + "` = ?";
        let temp = Object.values(data).concat(Object.values(where_data));
        let [res] = await db.query(sql, temp);       
        return (res.affectedRows > 0);
    } catch (e) {
        errors.log(e);
        return 0;
    }
};

exports.delete = async (table_name, where_data) => {
    try {
        let sql = "DELETE FROM " + table_name + " WHERE " + Object.keys(where_data).join(' = ? AND ') + " = ?";
        let temp = Object.values(where_data).concat(Object.values(where_data));
        let [res] = await db.query(sql, temp);
        return (res.affectedRows > 0);
    } catch (e) {
        errors.log(e);
        return 0;
    }
};

exports.transaction = async (queries) => {
    let trans = new db.Transaction();
    try {
        await trans.begin();

        let c;
        for (let i = 0; i < queries.length; i++) {
            let trx = queries[i];
            switch (trx.method) {
                case 'INSERT':
                    c = await trans.insert(trx.table_name, trx.data);
                    break;
                case 'UPDATE':
                    c = await trans.update(trx.table_name, trx.data, trx.where_data);
                    break;
                case 'DELETE':
                    c = await trans.delete(trx.table_name, trx.where_data);
                    break;
                case 'REPLACE':
                    c = await trans.replace(trx.table_name, trx.data);
                    break;
                default:
                    c = await trans.sql(trx.sql, trx.data);
            }

        }
        await trans.commit();      
        return 1;
    } catch (e) {
        errors.log(e);
        trans.rollback();
        return 0;
    }
};

exports.call = async (procedure_name, data) => {
    try {
        let [res] = await db.query("CALL " + procedure_name + " (?);", data);
        return 1;
    } catch (e) {
        errors.log(e);
        return 0;
    }
};