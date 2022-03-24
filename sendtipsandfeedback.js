const fs = require('fs');
const mysql = require('mysql2/promise');
const moment = require('moment');
const momenttimezone = require('moment-timezone')



fixTimeZones().then(()=>console.log("all fixed!"));

async function fixTimeZones(){
    try{

        let newConnection = await mysql.createConnection({
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
        const limit = 1000;
        let difference = 0;
        let lastID = 0;        
        let textsToSend = [];
        //grab all the users
        let [rows, fields] = await newConnection.execute('select * from users where groupID = 1 and paid >= current_timestamp() and userID > ' + lastID);
        let users = rows;
        //grab all the tip texts
        [rows, fields] = await newConnection.execute('select * from market_schedule ms left join tip_texts tt on ms.textID = tt.textID where tt.textID is not null and tt.active = 1 and ms.active = 1');
        let tipTexts = rows;        
        for(let i = 0; i < tipTexts.length; i++){
            textsToSend.push({textID: tipTexts[i].textID, days: tipTexts[i].days_from_start, time: tipTexts[i].time});
        }
        //add one word feedback text
        textsToSend.push({textID: 1448, days: 17, time: "12:51:00"});
        //add initial text that explains the tips
        textsToSend.push({textID: 1449, time: '13:36:00', days: 0})
        let usersTextsToSchedule = [];
        let sql = `insert into scheduled_queue (scheduled_queue.to, scheduled_queue.from, scheduled_queue.textID, scheduled_queue.datetime, scheduled_queue.sent, scheduled_queue.businessID) values `
        for(let j = 0; j < users.length; j++){
            let user = users[j];
            moment.tz.setDefault(user.tz_string);
            for(let k = 0; k < textsToSend.length; k++){                
                let text = textsToSend[k];
                var timeToSend = moment(text.time, 'HH:mm:ss').tz("America/New_York").format("HH:mm:ss");
                //console.log(user.tz_string, " resulted in ", timeToSend, " from ", text.time);
                usersTextsToSchedule.push(`(${user.userID}, ${user.assigned_num}, ${text.textID}, date_add('2021-02-08 ${timeToSend}', interval ${text.days} day), 0, 1)`);
            }
            
        }
        sql += usersTextsToSchedule.join(",");
        
        try{
            //console.log(sql);
            newConnection.execute(sql).then(()=>{console.log(`all users scheduled properly!`);}).catch((err)=>{console.log(err);});                    
        }
        catch(err){
            console.log(err);
        }
            
               
    }
    catch(err){
        console.log(err);
    }
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}
