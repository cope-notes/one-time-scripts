
const sgMail = require('@sendgrid/mail');
const emails = require("./inputs/emails.json")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fs = require("fs");
const signature = `<br><br><div dir="ltr" data-smartmail="gmail_signature"><div dir="ltr"><div><br></div><div><div style="color:rgb(0,0,0);font-family:Helvetica;font-size:12px"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><br></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div style="color:rgb(0,0,0);font-family:Helvetica;font-size:12px"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;color:rgb(68,68,68);width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><table style="font-size:10pt;text-align:start;border-spacing:0px;border-collapse:collapse;width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><img src="https://ci3.googleusercontent.com/proxy/4HrWvAYaP1hmGBxgmA4jjwXvrDUZumjHk1gDbapZ2BD2QDJmWbFp_wySFvk3yKXcN3imoeW0u3FXDmZRi6ksXmwnSDDJrpxHMXLkWp9EPufTDwq93S1-YQ=s0-d-e1-ft#https://copenotes.com/wp-content/uploads/2019/12/Closer-1024x1024.png" alt="" style="color:rgb(0,0,0);text-align:start" class="CToWUd a6T" tabindex="0" width="200" height="200"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 152px; top: 353.5px;"><div id=":1i6" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div></td><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;width:525px" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;width:525px" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><div><a href="https://t.sidekickopen14.com/s3t/c/5/f18dQhb0S7kF8cFDL-W4YWSs42zGCwVN8Jbw_8QsNH0W1yWZYz65jP-KW1pctGF2Pt2ZSf197v5Y04?te=W3R5hFj4cm2zwW4mKLS-3ZWVWBW3K2-zv1JxwY5W1Lyz993z8QlkW3K77Mk3M1YQlf3_R5CPV3&amp;si=8000000019257794&amp;pi=14750727-a40b-4745-cbc6-fb2f6ecfee36" rel="noopener" style="text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://t.sidekickopen14.com/s3t/c/5/f18dQhb0S7kF8cFDL-W4YWSs42zGCwVN8Jbw_8QsNH0W1yWZYz65jP-KW1pctGF2Pt2ZSf197v5Y04?te%3DW3R5hFj4cm2zwW4mKLS-3ZWVWBW3K2-zv1JxwY5W1Lyz993z8QlkW3K77Mk3M1YQlf3_R5CPV3%26si%3D8000000019257794%26pi%3D14750727-a40b-4745-cbc6-fb2f6ecfee36&amp;source=gmail&amp;ust=1638468171922000&amp;usg=AOvVaw2CWrFlunZRijhWTpJlAF1K"><b><font color="#0c343d">Adrienne Feldmann</font></b></a></div><span style="color:rgb(0,51,58);font-size:10pt">Account Manager</span><font face="Arial, sans-serif" color="#00333a"></font></td></tr><tr><td style="padding:5px 0px 5px 10px;vertical-align:top" valign="top"><b style="color:rgb(140,140,140);font-family:Arial,sans-serif">phone:&nbsp;</b><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">1-888-705-COPE<br></span><font size="2" face="Arial, sans-serif" color="#8c8c8c"><b>email:&nbsp;</b></font><a href="mailto:adrienne@copenotes.com" style="font-size:10pt;color:rgb(140,140,140);font-family:Arial,sans-serif" target="_blank">adrienne@copenotes.com</a><span style="color:rgb(140,140,140);font-family:Arial,sans-serif"><br></span><b style="color:rgb(140,140,140);font-family:Arial,sans-serif">postal:&nbsp;</b><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">1551 Flournoy Cir W Suite 1401</span><br style="color:rgb(140,140,140);font-family:Arial,sans-serif"><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">Clearwater, FL 33764</span><font face="Arial, sans-serif" color="#8c8c8c"><br></font></td></tr><tr><td style="font-family:Arial,sans-serif;padding:5px 0px 10px 10px;font-size:10pt;vertical-align:middle" valign="middle"><span style="font-size:10pt"><a href="http://www.copenotes.com/" rel="noopener" style="text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.copenotes.com/&amp;source=gmail&amp;ust=1638468171922000&amp;usg=AOvVaw0-ybhr6_5vcmZV1JVUdR9l"><b><font color="#0c343d">www.copenotes.com</font></b></a><br><font color="#00333a">Daily Mental Health Support<br><a href="https://t.sidekickopen14.com/s3t/c/5/f18dQhb0S7kF8cFDL-W4YWSs42zGCwVN8Jbw_8QsNH0W1yWZYz65jP-KW1pctGF2Pt2ZSf197v5Y04?te=W3R5hFj26QkG_W43VqYY43X4SyW1JxwY51LF6Dq22d3&amp;si=8000000019257794&amp;pi=14750727-a40b-4745-cbc6-fb2f6ecfee36" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://t.sidekickopen14.com/s3t/c/5/f18dQhb0S7kF8cFDL-W4YWSs42zGCwVN8Jbw_8QsNH0W1yWZYz65jP-KW1pctGF2Pt2ZSf197v5Y04?te%3DW3R5hFj26QkG_W43VqYY43X4SyW1JxwY51LF6Dq22d3%26si%3D8000000019257794%26pi%3D14750727-a40b-4745-cbc6-fb2f6ecfee36&amp;source=gmail&amp;ust=1638468171922000&amp;usg=AOvVaw3l-C1xKU64EEXO7mpiUn8I">Watch our TEDx Talk</a></font></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div></div></div><img src="https://ci3.googleusercontent.com/proxy/CTA_z-Au8OockdJ9Cmil30QeaDq9_s8MdeRRsKuMShtDkEGKAzNt6aLUdcBJW-9SRht8TULQR2XvhHcQKd_Yi5HTZ3ZJud_OhoS7-oTLFeuOo-jhleUi6gyaGQZVkVHfprjRlvOEon66HzbvE5LnKHpUQJ-FEy-idpaAU62SrFNq1KjDAghHRaDgcfqrSBXESg5N0qIyepSPn8ezFgNsMsEC-PCpYqVacWQflgyFXZwyxZYmNFnXLy9I8NVCjzpewp4z1Z1D66HhYdTy345VwA=s0-d-e1-ft#https://t.sidekickopen14.com/s3t/o/5/f18dQhb0S7n28cFDL-W4YWSs42zGCvGW40Fv_62SXv86W5KVzKF5vwmp4W8q-8kM56dT0lf7YQB5g02?si=8000000019257794&amp;pi=14750727-a40b-4745-cbc6-fb2f6ecfee36&amp;ti=26237578" alt="" style="display:none!important" class="CToWUd" jslog="138226; u014N:xr6bB; 53:W2ZhbHNlXQ.." width="1" height="1"><div class="yj6qo"></div><div class="adL"></div></div>`
const emoji = "✨";
let date = new Date();
const timeToSend = 1640204100; 
console.log(timeToSend)
const text =`2021 has been a wild ride, and things wouldn't have been the same at Cope Notes without you in our corner.<br><br>
I was wondering how we could express our gratitude for your support this year, and I think I have just the thing:<br><br>
I created the coupon code <strong>MERRY</strong> so that you could save 20% on any subscription you like! You can redeem your coupon <a href="copenotes.com/gift?coupon=MERRY" target="_blank" rel="noopener noreferrer">here</a>.<br><br>
On the heels of a year like this one, a gift subscription of daily support and encouragement could be exactly what someone in your life needs right now. Plus, it's a unique and personal way to show them just how much you care. <br><br>
No matter who you choose to give this special gift to, we want to wish a very happy holiday season to you and all of your favorite people!`;
const subject = `Warm wishes and a special gift ${emoji}`;
//sendEmailWithAttachment("adrienne@copenotes.com", text + signature, "A little something for you! ✨", pathToAttachments);
//scheduleFutureEmail(["adrienne@gmail.com", "holycow2450@gmail.com"], text + signature, subject, timeToSend);
let numToSend = 0;
let maxToSend = 1000;
let emailsToSend = [];
for(let i = 0; i < emails.length; i++) {
    emailsToSend.push(emails[i].email);    
    numToSend++;
    if(numToSend >= maxToSend || i == emails.length - 1){
      console.log(JSON.stringify(emailsToSend));
      console.log("numToSend:", numToSend);
      console.log("timeToSend:", new Date(timeToSend * 1000).toISOString());
      scheduleFutureEmail(emailsToSend, text + signature, subject, timeToSend);
      emailsToSend = [];
      numToSend = 0;
    }
}

function scheduleFutureEmail(emails, body, subject, timeToSend){   

    let msg;
    if(!timeToSend){
      msg = {
        to: emails,
        from: {email:'adrienne@copenotes.com', name: "Adrienne"},
        subject: subject,
        html: body
      };
    }
    else{
      msg = {
        to: emails,
        from: {email:'adrienne@copenotes.com', name: "Adrienne"},
        subject: subject,
        html: body,
        send_at: timeToSend
      };
    }

    
    sgMail.sendMultiple(msg).catch(err => {
      console.log("error:", JSON.stringify(err));
    });
}