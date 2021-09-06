var DataBase_Connection = "postgres://trackmhr_pfa:AmineTayebOmar123@localhost:5432/trackmhr_pfaAPIs";
const pg = require("pg");
const client = new pg.Client(DataBase_Connection);
module.exports = client;