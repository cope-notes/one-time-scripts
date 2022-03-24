const fs = require('fs');
const fetch = require("node-fetch");
const moment = require('moment');
const momenttimezone = require('moment-timezone')
const listOfUsers = require("./inputs/cignaGroupVouchers.json"); //TODO: change this to use the correct input
const codeForVoucher = "CIGNA3";  //TODO: change this to use the correct voucher code
const microserviceURL = 'https://us-central1-e-copilot-224821.cloudfunctions.net/fillVoucher-live'
//const microserviceURL = 'https://us-central1-e-copilot-224821.cloudfunctions.net/fillVoucherTest'
const MSUSER = process.env.MSUSER;
const MSKEY = process.env.MSKEY;

fillVouchersFromList().then(()=>console.log("all fixed!"));


async function fillVouchersFromList(){    
    const login = {
        "user":MSUSER,
        "key":MSKEY
    }
    const assigned_num = 53;
    const groupID = 1;
    const businessID = 1;
    const intCode = '+1';
    const attributes = {"code": codeForVoucher, "type": "voucher", "source": "manual-script", "business": "1"}
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    
    try{
        //limit to only send 10 users per voucher fill call, so the microservice doesn't timeout and it will go faster as it 
        //processes the results in parallel. 
        let promises = [];
        const limit = 50;
        let num = 0; 
        let usersToFill = [];
        for(let i = 0; i < listOfUsers.length; i++){
            let usersPhone = listOfUsers[i];
            let userObject = {
                "phone": usersPhone,
                "intCode": intCode,
                "tz_payload": {"phone": intCode + "" + usersPhone, "priority": 1}, 
                "code": codeForVoucher,
                "datetime": now,
                "groupID": groupID,
                "assigned_num": assigned_num,
                "attributes": JSON.stringify(attributes),
                "businessID": businessID
            }
            console.log(usersPhone);
            usersToFill.push(userObject);
            num++;
            if(num === limit || i === listOfUsers.length - 1){
                let promise = await queueTask(microserviceURL, {login: login, code: codeForVoucher, users: usersToFill, datetime: now, notify: false})
                promises.push(promise);
                console.log(`another ${limit} processed!`)
                num = 0; 
                usersToFill = [];
            }
            Promise.all(promises).then(Promise.resolve());
        }      
    }
    catch(err){
        console.log(err);
    }
}


//queue up task
function queueTask(taskURL, payload){    
    return new Promise(async (resolve, reject)=>{
        const suffix = 'live';
        if(payload && taskURL){
            try{
                console.log(`queueing: ${taskURL} with payload: ${payload}`);
                let url = `https://us-central1-e-copilot-224821.cloudfunctions.net/insert-task-${suffix}`
                let res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: taskURL, payload: payload }),
                })
                console.log(res);
                if(res.status == 200){           
                    resolve();
                }
                else{    
                    console.error(new Error(`Error queueing task for microservice: ${taskURL} with payload: ${payload}`))        
                    reject();
                }
            }
            catch(err){
                console.error(new Error(err));
                reject();
            }
        }
        else{
            console.error(new Error(`Missing info`));
            reject();
        }
    })
}


