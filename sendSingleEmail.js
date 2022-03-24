const http = require("https");

sendDashboardInvite('Melissa.McCoy@saline.org', 'Saline County', 'AnXzIOVl7bhW')

function sendDashboardInvite(email, name, setPassToken){
    return new Promise((resolve, reject)=>{
        const inviteURL = `https://group.copenotes.com/#/set-password/${setPassToken}`;
        sendTemplate(email, 'd-2b6ffa160bf64e9cb2faa39224336217', {inviteURL: inviteURL, businessName: name}, {email:'support@copenotes.com',name:'Cope Notes Enterprise'});
        resolve();
    })
}

function sendTemplate(email, template_id, data, from = {
    email: "support@copenotes.com",
    name: "Cope Notes"
}){
    console.log("sending templateID:" + template_id + " to:" + email);
    const options = {
        "method": "POST",
        "hostname": "api.sendgrid.com",
        "port": null,
        "path": "/v3/mail/send",
        "headers": {
            "authorization": "Bearer " + process.env.SENDGRID_API_KEY,
            "content-type": "application/json"
        }
    };
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(JSON.stringify({
        personalizations:
            [{
                to: [{email: email, name: email}],
                dynamic_template_data: data,
            }],
        from: {email: from.email, name: from.name},
        reply_to: {email: from.email, name: from.name},
        template_id: template_id,
        asm: {group_id: 11020}
    }));
    req.end();
}