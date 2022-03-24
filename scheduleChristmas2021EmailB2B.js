
const sgMail = require('@sendgrid/mail');
const emails = require("./inputs/group-emails.json")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fs = require("fs");
const signature = `<div><div><div dir="ltr" data-smartmail="gmail_signature"><div dir="ltr"><div><div><div dir="ltr"><div><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><br></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div><div><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><br></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;color:rgb(68,68,68);width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><table style="font-size:10pt;text-align:start;border-spacing:0px;border-collapse:collapse;background-color:transparent;width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><img src="https://ci3.googleusercontent.com/proxy/4HrWvAYaP1hmGBxgmA4jjwXvrDUZumjHk1gDbapZ2BD2QDJmWbFp_wySFvk3yKXcN3imoeW0u3FXDmZRi6ksXmwnSDDJrpxHMXLkWp9EPufTDwq93S1-YQ=s0-d-e1-ft#https://copenotes.com/wp-content/uploads/2019/12/Closer-1024x1024.png" alt="" style="color:rgb(0,0,0);text-align:start" class="CToWUd a6T" tabindex="0" width="200" height="200"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 152px; top: 374.5px;"><div id=":32g" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div></td><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;width:525px" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;width:525px" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><div><a href="http://linkedin.com/in/johnnycrowder/" rel="noopener" style="background-color:transparent;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://linkedin.com/in/johnnycrowder/&amp;source=gmail&amp;ust=1640271746265000&amp;usg=AOvVaw0virYwK-UgHmwLt_xk9hQF"><b><font color="#0c343d">Johnny Crowder</font></b></a></div><span style="color:rgb(0,51,58);font-size:10pt">Founder &amp; CEO</span><font face="Arial, sans-serif" color="#00333a"><span></span></font></td></tr><tr><td style="padding:5px 0px 5px 10px;vertical-align:top" valign="top"><b style="color:rgb(140,140,140);font-family:Arial,sans-serif">phone: </b><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">(813) 444-5958<br></span><font size="2" face="Arial, sans-serif" color="#8c8c8c"><b>email:&nbsp;</b></font><a href="mailto:johnny@copenotes.com" style="font-size:10pt;color:rgb(140,140,140);font-family:Arial,sans-serif" target="_blank">johnny@copenotes.com</a><span style="color:rgb(140,140,140);font-family:Arial,sans-serif"><br></span><b style="color:rgb(140,140,140);font-family:Arial,sans-serif">postal:&nbsp;</b><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">1551 Flournoy Cir W,&nbsp;Suite 1401</span><br style="color:rgb(140,140,140);font-family:Arial,sans-serif"><span style="color:rgb(140,140,140);font-family:Arial,sans-serif">Clearwater, FL 33764</span><font face="Arial, sans-serif" color="#8c8c8c"><br></font></td></tr><tr><td style="font-family:Arial,sans-serif;padding:5px 0px 10px 10px;font-size:10pt;vertical-align:middle" valign="middle"><span style="background-color:transparent;font-size:10pt"><a href="http://www.copenotes.com/" rel="noopener" style="background-color:transparent;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.copenotes.com/&amp;source=gmail&amp;ust=1640271746265000&amp;usg=AOvVaw3UpfbsLrS9ZaPA0gLuTyHi"><b><font color="#0c343d">www.copenotes.com</font></b></a><br><font color="#00333a">Daily Mental Health Support<br><a href="http://copenotes.com/tedx" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://copenotes.com/tedx&amp;source=gmail&amp;ust=1640271746265000&amp;usg=AOvVaw12o7rFGEgLqVeZy9QsdmvU">Watch my TEDx Talk</a></font></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;color:rgb(68,68,68);width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><table style="font-size:10pt;text-align:start;border-spacing:0px;border-collapse:collapse;background-color:transparent;width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><br></td><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;width:525px" cellspacing="0" cellpadding="0"><tbody></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><table style="font-size:10pt;border-spacing:0px;border-collapse:collapse;background-color:transparent;color:rgb(68,68,68);width:525px;font-family:Arial,sans-serif" cellspacing="0" cellpadding="0"><tbody><tr><td rowspan="3" style="padding:0px 10px 0px 0px;font-size:10pt;width:199px;vertical-align:top;text-align:center" valign="top" align="center"><br></td><td style="font-family:Arial,sans-serif;padding:0px 0px 5px 10px;width:326px;vertical-align:top" valign="top"><br></td></tr><tr><td style="padding:5px 0px 5px 10px;vertical-align:top" valign="top"><br></td></tr></tbody></table></div></div></div></div></div></div></div></div></div><span style="color:rgb(0,51,58);font-size:10pt"></span></div></div></div></div></div>`
const emoji = "✨";
let date = new Date();
const timeToSend = 1640206800; 
console.log(timeToSend)
const text =`Don't worry, I'm not emailing to ask you for any last-minute end-of-year favors, haha.<br><br>
I just wanted to take a second to say thanks.<br><br>
This year has been absolutely mind-bending, and without partners like you actually giving a hoot about mental health and working with us to make a difference, I have no idea where we'd be today.<br><br>
There are real people out there who are still alive right now because of you. That is powerful stuff. I think about it all the time.<br><br>
Just... thank you. For real.`;
const subject = `Thank you... a lot`;
//sendEmailWithAttachment("adrienne@copenotes.com", text + signature, "A little something for you! ✨", pathToAttachments);
//scheduleFutureEmail(["holycow2450@gmail.com", "johnny@copenotes.com"], text + signature, subject, timeToSend);
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
        from: {email:'johnny@copenotes.com', name: "Johnny Crowder"},
        subject: subject,
        html: body
      };
    }
    else{
      msg = {
        to: emails,
        from: {email:'johnny@copenotes.com', name: "Johnny Crowder"},
        subject: subject,
        html: body,
        send_at: timeToSend
      };
    }

    
    sgMail.sendMultiple(msg).catch(err => {
      console.log("error:", JSON.stringify(err));
    });
}