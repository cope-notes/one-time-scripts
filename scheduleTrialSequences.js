const fs = require('fs');
const mysql = require('mysql2/promise');
const moment = require('moment');
const momenttimezone = require('moment-timezone');



assignTrialSequences().then(()=>console.log("all fixed!"));

async function assignTrialSequences(){
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
        //grab all the users
        let [rows, fields] = await newConnection.execute(`SELECT users.* FROM CopeNotes2021.users
        left join trialUsers tu on users.userID = tu.userID
        where users.groupID = 99
        and tu.userID is null
        and added > '2021-01-01'
        and users.attributes regexp 'sample'
        `);
        let  users = rows;
        for(let i = 0; i < users.length; i++){
            user = users[i];
            console.log(user);
            let rows = await findTrial(user.userID, user.tz_string, user.attributes.source, newConnection)
            await scheduleTrial(rows, user.userID, user.tz_string, newConnection)
        }
           
          
        Promise.resolve();            
    }
    catch(err){
        console.log(err);
    }
}

//first select the the cohart with the least amount  of users assigned
function findTrial(userID, tz, source, connection){
    return new Promise(async (resolve, reject)=>{
        var query = `SELECT tg.idtrialGroups, tg.trialID FROM trialGroups as tg where (tg.deactivated is null or tg.deactivated > current_timestamp()) order by lastUsed asc LIMIT 1`;
        console.log(query);
        let [trialGroup] = await connection.execute(query);
        const chosenGroup = trialGroup[0].idtrialGroups
        const chosenTrial = trialGroup[0].trialID;
        //after a group is selected, insert the user into the trialUsers table so that the next user gets a different group
        query = `INSERT INTO trialUsers (userID, idtrialGroups, source, startDate) Values( ${userID}, ${chosenGroup}, '${source}', (select added from users where userID = ${userID}))`;
        console.log(query);
        await connection.execute(query);       
        console.log("insertion into trial users table successfull");
        await updateTrialGroup(chosenGroup, connection);
        query = `select * from trial_schedule where trialID = ${chosenTrial}`;
        console.log(query);
        let [rows] = await connection.execute(query);
        resolve(rows);                    
    })    
}

function scheduleTrial(rows, userID, tz_string, connection) {
    return new Promise((resolve, reject)=>{
        const to = userID;
        const from = 53;
        moment.tz.setDefault(tz_string);
        var query = "INSERT INTO scheduled_queue (`to`, `from`, `textID`, `datetime`, `sent`) Values";
        const numTexts = rows.length;
        var numDone = 0;
        rows.forEach(record => {
            var timeToSend = moment(record.time, 'HH:mm').tz("America/New_York").add(record.days_from_start,'days').format("YYYY-MM-DD HH:mm:ss");
            //console.log(moment(record.time, 'HH:mm').tz(user.tz_string).add(record.days_from_start,'days').format("YYYY-MM-DD HH:mm:ss")+ "\n");
            query += "( '"+to+"', '"+from+"'," + record.textID + ", '"+timeToSend+"','0')";
            numDone++;
            if(numDone < numTexts){
                query += ",";
            }
        });
        console.log(query);
        resolve(connection.execute(query));
    })    
}

function updateTrialGroup(idtrialGroups, connection){
    return new Promise((resolve, reject)=>{
        var insert = `update trialGroups set lastUsed = current_timestamp() where idtrialGroups = ${idtrialGroups}`;
        console.log(insert);
        resolve(connection.execute(insert));
    });
}
