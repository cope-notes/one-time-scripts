const plivo = require('plivo');
const mysql = require('mysql2/promise');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const usersToFix = [1451901, 1451899, 1451897, 1451895, 1451894, 1451877, 1451836, 1451760, 1451753, 1451737, 1451733, 1451719, 1451670, 1451655, 1451648, 1451554];

fixTipTexts().then(()=>{
    console.log("done");
})

async function fixTipTexts(){
    
    let tipTexts = await grabTipTexts();
    for(let i = 0; i < usersToFix.length; i++){
        let userID = usersToFix[i];
        console.log(userID);
        let usersTextsAndInfo = await grabUsersScheduledTextsAndInfo(userID)
        //console.log(usersTextsAndInfo);
        let failedTexts = await findFailedTexts(tipTexts, usersTextsAndInfo);
        //console.log("returned failed texts", failedTexts);
        if(failedTexts && failedTexts.length > 0){
            fixTexts(failedTexts)
        }
    } 

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
            ssl: {
                ca: fs.readFileSync(__dirname + '/certs/server-ca.pem'),
                key: fs.readFileSync(__dirname + '/certs/client-key.pem'),
                cert: fs.readFileSync(__dirname + '/certs/client-cert.pem')
            }
        });
        resolve(connection);
    })    
}

const client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);    
async function grabPlivoLog(message_uuid){
    try{
        //console.log('grabbing logs from plivo for:', message_uuid)
                
        let subList = await client.messages.get(
            message_uuid
        ) 
        //console.log('retrieved log');
        return subList;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

async function findFailedTexts(tipTexts, userTexts){
    const failedTexts = [];
    let promises = [];
    for(let i = 0; i < userTexts.length; i++){
        let currentText = userTexts[i];
        if(currentText.message_uuid){
            if(currentText.message_uuid != 'paused'){
                let message = await grabPlivoLog(currentText.message_uuid)
                promises.push(message);
                //console.log(message.errorCode);
                if(message.errorCode && message.errorCode == '30'){                
                    //console.log('this one is marked as spam');
                    let tipText = _.find(tipTexts, {textID: currentText.textID})
                    if(typeof tipText !== 'undefined'){
                        //console.log("is a tip");
                        failedTexts.push(currentText);
                    }                
                }
                else{
                    //console.log('not spam');
                }
            }
            else{
                //console.log("is paused");
                failedTexts.push(currentText);
            }  
        }
    }
    await Promise.all(promises)
    return failedTexts;
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