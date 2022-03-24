const plivo = require('plivo');
const mysql = require('mysql2/promise');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const texts = require("./text-categories.json")

const cipher = {
    1: [1,13],
    2: [2,14],
    3: [3,15],
    4: [4,16],
    5: [5,17,18],
    6: [6,19],
    7: [7,20],
    8: [8,21],
    9: [9,22],
    10: [10,23]
}

let connection; 

decodeCategory = (categoryID) => {
    const id = categoryID;
    let cipherIDs = Object.keys(cipher);
    console.log(cipherIDs);
    console.log(id);
    if(cipher[id]){
        return cipher[id];
    }
    else
        return [id];
}

fixTextCategories().then(()=>{
    console.log("done");
})

async function fixTextCategories(){ 
    if(!connection){
        connection = await setConnection();
    }   
    for(let i = 0; i < texts.length; i++){
        let text = texts[i];
        console.log(text);
        let categories = text.categories;
        let decodedCategories = [];
        if(categories){
            categories = categories.replace("[", "").replace("]", "")
            categories = categories.split(",");
            categories.forEach((cat)=>{
                decodedCategories.push(...decodeCategory(cat))
            })
        }
        fixTexts(text.textID, decodedCategories)        
    } 

}

function setConnection(){
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


async function insertCategories(categories){
    
    let insertQuery = `insert into text_categories (textID, categoryID, deleted) values ${categories.join(",")}`;
    console.log(insertQuery);
    let [rows, fields] = await connection.execute(insertQuery);
    return null;
}

function fixTexts(textID, categories){
    let catsToInsert = [];
    console.log(categories)
    categories.forEach((category)=>{
        catsToInsert.push(`(${textID}, ${category}, 0)`)
    })
    insertCategories(catsToInsert);
    return;
}


