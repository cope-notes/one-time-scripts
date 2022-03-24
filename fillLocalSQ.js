const plivo = require('plivo');
const mysql = require('mysql2/promise');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');



fillScheduledQueue().then(()=>{
    console.log("done");
})

async function fillScheduledQueue(){
    let startDate = '2020-07-16 17:53:02';
    let endDate = '2021-07-15 17:53:02';
    let currentDate = startDate;
    let insertQuery = `insert into scheduled_queue (scheduled_queue.to, scheduled_queue.from, scheduled_queue.textID, scheduled_queue.datetime, scheduled_queue.sent) values `;
    let values = [];
    while(moment(currentDate).format("x") <= moment(endDate).format("x")){
        let newValue = `(1449985, 53, 1391, '${currentDate}', 1)`;
        values.push(newValue);
        currentDate = moment(currentDate).add(1, 'days').format("YYYY-MM-DD HH:mm:ss")
    }
    insertQuery += values.join(",")
    console.log(insertQuery);
    const connection = await setConnection();
    let [rows, fields] = await connection.execute(insertQuery);
}

async function grabUsersScheduledTextsAndInfo(userID){   
    const connection = await setConnection();
    //grab all the users texts
    let [rows, fields] = await connection.execute(`select * from scheduled_queue sq left join users u on sq.to = u.userID where sq.to = ${userID} and sq.datetime > '2021-04-15'`);
    return rows;
}

async function grabTipTexts(){
    const connection = await setConnection();
    let [rows, fields] = await connection.execute(`select * from tip_texts`);
    return rows;
}

function setConnection(){
    return new Promise(async (resolve, reject)=>{
        const connection = await mysql.createConnection({
            host: process.env.DBHOST,//
            user: process.env.DBUNAME,//
            password: process.env.DBPASS,//
            database: process.env.DBNAME,//
            // ssl: {
            //     ca: fs.readFileSync(__dirname + '/certs/server-ca.pem'),
            //     key: fs.readFileSync(__dirname + '/certs/client-key.pem'),
            //     cert: fs.readFileSync(__dirname + '/certs/client-cert.pem')
            // }
        });
        resolve(connection);
    })    
}

async function insertTexts(texts){
    const connection = await setConnection();
    let insertQuery = `insert into scheduled_queue (scheduled_queue.to, scheduled_queue.from, scheduled_queue.textID, scheduled_queue.datetime, scheduled_queue.sent, scheduled_queue.message_uuid, scheduled_queue.businessID) values ${texts.join(",")}`;
    console.log(insertQuery);
    let [rows, fields] = await connection.execute(insertQuery);
    return null;
}

function fixTexts(failedTexts){
    let sortedTexts = _.sortBy(failedTexts, [function(o) { return o.datetime; }]);
    let daysAheadToSchedule = 1; 
    let fixedTexts = [];
    sortedTexts.forEach((text)=>{
        fixedTexts.push(`(${text.to}, ${text.from}, ${text.textID}, '${ moment().add(daysAheadToSchedule, 'days').format('YYYY-MM-DD') + " " + moment(text.datetime).format('HH:mm:ss')}', 1, 'tip-text-fix', ${text.businessID})`)
        daysAheadToSchedule++;
    })
    insertTexts(fixedTexts);
    return;
}

//calculate the number of days from today to the given date
function daysFromToday(dateString){
    var today = new Date();
    var date_to_reply = new Date(dateString);
    var timeinmilisec = today.getTime() - date_to_reply.getTime();
    return( Math.abs(Math.floor(timeinmilisec / (1000 * 60 * 60 * 24))) );
}