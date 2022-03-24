const textGroup = require("./inputs/holidaySales1520.json");
const fs = require('fs');
const mysql = require('mysql2/promise');
const moment = require('moment');
const momenttimezone = require('moment-timezone');
const plivo = require('plivo');
const client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);
const text = `As Thanksgiving draws closer, let's focus on gratitude!

Use the code THANKFUL to get 25% off a subscription for you or a friend :)

Redeem: copenotes.com/next`
const textID = 1520;

let connection = null;

sendTextThroughPlivo(textGroup).then(()=>console.log("all fixed!"));



//send a text to a list of users with plivo api
async function sendTextThroughPlivo(textList){
    if(connection == null){
        connection = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUNAME,
            password: process.env.DBPASS,
            database: process.env.DBNAME,
            ssl: {
                ca: fs.readFileSync(__dirname + '/certs/server-ca.pem'),
                key: fs.readFileSync(__dirname + '/certs/client-key.pem'),
                cert: fs.readFileSync(__dirname + '/certs/client-cert.pem')
            }
        });
    }
    let promises = [];
    for(let i = 0; i < textList.length; i++){         
        console.log("sending to:", textList[i].phone)
        let to = "+1" + "" + textList[i].phone;
        //let uuid = await sendWithPlivo(to);
        //promises.push(uuid);
        let uuid = "manual-uuid-" + i;
        let update = await updateDatabase(uuid, to, connection);
        promises.push(update);
    }
    return Promise.all(promises);
}

async function sendWithPlivo(to){
    try{
        console.log("sending to:", to)
        let response = await client.messages.create(
            {
                'src': '18887052673', //src
                'dst': to, // dst
                'text': text, // text
                'type': 'sms',
                'method': "POST",
                'url': "https://us-central1-e-copilot-224821.cloudfunctions.net/plivo-delivery-reports-live"
            }
        )
        console.log("text sent successfully");  
        console.log(response); 
        return Promise.resolve(response.messageUuid[0]);
    }
    catch(err){
        Promise.reject(err);
    }
}

async function updateDatabase(message_uuid, to, connection){    
    let scheduleQuery = 'insert into scheduled_queue (  `sent`, `message_uuid`, `to`, `from`, `textID`, `datetime`) values ';
    let singleValue = `( 1, '${message_uuid}', (select userID from users where concat(users.int_code, users.phone) = '${to}'), 53, ${textID}, current_timestamp())`
    scheduleQuery = scheduleQuery + singleValue;
    console.log(scheduleQuery);
    let update = await connection.execute(scheduleQuery);
    console.log("database updated successfully") 
    return Promise.resolve(update);
}