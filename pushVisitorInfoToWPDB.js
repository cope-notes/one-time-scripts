const fs = require('fs');
const fetch = require("node-fetch");
const moment = require('moment');
const momenttimezone = require('moment-timezone')
const mysql = require('mysql2/promise');

main().then(()=>{console.log("done")})

function setProdConnection(){
    return new Promise(async (resolve, reject)=>{
        const connection = await mysql.createConnection({
            host: process.env.DBHOST,//
            user: process.env.DBUNAME,//
            password: process.env.DBPASS,//
            database: process.env.DBNAME,//
            ssl: {
                ca: fs.readFileSync(__dirname + '/certs/server-ca.pem'),
                key: fs.readFileSync(__dirname + '/certs/client-key.pem'),
                cert: fs.readFileSync(__dirname + '/certs/client-cert.pem')
            }
        });
        resolve(connection);
    })    
}

function setWPDBConnection(){
    return new Promise(async (resolve, reject)=>{
        const connection = await mysql.createConnection({
            host: process.env.WPDBHOST,//
            user: process.env.WPDBUNAME,//
            password: process.env.WPDBPASS,//
            database: process.env.WPDBNAME,
            port: process.env.WPDBPORT
        });
        resolve(connection);
    })    
}

//select the next page of visitors from the visitor table in the production database
async function getVisitors(connection, lastVisitorID){
    return new Promise(async (resolve, reject)=>{
        let query = "SELECT * FROM `visitors` WHERE `idvisitors` > ? LIMIT 100";
        let [rows, fields] = await connection.query(query, [lastVisitorID]);
        //console.log(query);
        resolve(rows);
    })
}

//insert visitors into wpdb
async function insertVisitors(connection, visitors){
    return new Promise(async (resolve, reject)=>{
        
        let values = [];
        visitors.forEach((visitor)=>{
            values.push(`(${visitor.idvisitors},'${visitor.IP}','${visitor.datetime.toISOString().slice(0, 19).replace('T', ' ')}',${visitor.idpriceGroups}, '${visitor.added.toISOString().slice(0, 19).replace('T', ' ')}', ${visitor.numVisits})`);
        })
        let query = "INSERT INTO `wp_9bvy61fjzg_copenotes_visitors` (idvisitors, IP, datetime, idpriceGroups, added, numVisits) VALUES " + values.join(',');
        //console.log(query);
        let [rows, fields] = await connection.query(query);
        console.log(rows);
        resolve(rows);
    })
}


async function main(){
    let prod = await setProdConnection();
    let wpdb = await setWPDBConnection();
    let lastVisitorID = 0;
    while(true){
        let visitors = await getVisitors(prod, lastVisitorID);
        if(visitors.length == 0){
            break;
        }
        lastVisitorID = visitors[visitors.length - 1].idvisitors;
        await insertVisitors(wpdb, visitors);
    }
}

