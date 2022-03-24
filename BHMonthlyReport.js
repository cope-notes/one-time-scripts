const ExcelJS = require('exceljs');
const sgMail = require('@sendgrid/mail');
const mysql = require('mysql2/promise');
const fs = require('fs');
const stripe = require("stripe")(process.env.STRIPESECRET);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

createAndSendMonthlyReport();

//const email = "holycow2450@gmail.com";
const email = "finance@benefithub.com";
const subject = "Request for invoice - Cope Notes";
const month = getLastMonth();
const body = `Dear BenefitHub,<br><br>

Attached is a report of BenefitHub member purchases in ${month}.<br><br>

Please send an invoice for the enclosed amount to info@copenotes.com, including any details regarding how to route our ACH or Credit Card payment.<br><br>

We're thankful for your partnership, and for the opportunity to change and save lives together!`;

async function createAndSendMonthlyReport(){
    try{
        let data = await getDataFromStripe();
        let attachment = await createWorkbook(data);
        sendEmailWithAttachment(email, body, subject, attachment);
        console.log("Monthly Report sent");
    }
    catch(err){
        console.log(err);
    }
}



async function createWorkbook(data){
    console.log("Creating workbook");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mathew Cross';
    workbook.lastModifiedBy = 'Script';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    // freeze first row and column
    const worksheet = workbook.addWorksheet('Monthly Report', {views:[{state: 'frozen', xSplit: 0, ySplit: 1}]});
    worksheet.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Date of Payment', key: 'date' },
        { header: 'Purchase URL', key: 'url' },
        { header: 'Amount Paid', key: 'paid' },
        { header: 'Amount Owed', key: 'owed' }
      ];
    let total = 0;
    let i = 0;
    for(i; i < data.length; i++){
        worksheet.addRow(data[i]);
        total += parseFloat(data[i].owed);
    }
    total = {
      richText: [
        {font: {bold: true}, text: total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      ]
    }
    worksheet.addRow({id: "Total", date: "sum", url: "", paid: "", owed: total});
    worksheet.addRow({id: "Count", date: "", url: i, paid: "", owed: ""})
    // file writing
    let dateQualifier = getLastMonth().slice(0, 3).toUpperCase() + `${new Date().getFullYear()}`;
    let sheetName = `BenefitHub_Monthly_Report_${dateQualifier}.xlsx`;
    await workbook.xlsx.writeFile(sheetName);
    console.log("Workbook created");
    return sheetName;
}

function sendEmailWithAttachment(email, body, subject, fileName, timeToSend){ 
    console.log("Sending email");
    let attachments = [];    
    attachments.push({
        filename: fileName.split("/").pop(),
        content: fs.readFileSync(fileName).toString("base64"),
        contentId: fileName,
        disposition: "attachment"
    });
   
    let msg;
    if(!timeToSend){
      msg = {
        to: [email],
        from: {email:'info@copenotes.com', name: "Cope Notes"},
        subject: subject,
        html: body,
        attachments: attachments
      };
    }
    else{
      msg = {
        to: [email],
        from: {email:'info@copenotes.com', name: "Cope Notes"},
        subject: subject,
        html: body,
        attachments: attachments,
        send_at: timeToSend
      };
    }
    
    sgMail.send(msg).catch(err => {
      console.log("error:", JSON.stringify(err));
    });
}

async function getDataFromWPDB(){
    console.log("Getting data from WPDB");
    let data = [];
    try{
      let connection = await setWPDBConnection();
      let query = `SELECT * FROM pantheon.wp_9bvy61fjzg_gf_entry_meta m left join pantheon.wp_9bvy61fjzg_gf_entry e on e.id = m.entry_id where m.meta_value = 'benefithub' and e.payment_date BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01 00:00:00')
      AND DATE_FORMAT(LAST_DAY(NOW() - INTERVAL 1 MONTH), '%Y-%m-%d 23:59:59')`;
      let [rows, fields] = await connection.query(query);
      //console.log(query);
      console.log("Data retrieved:", rows);
      let formattedData = formatWPDBData(rows);
      console.log("Data formatted:", formattedData);
      return Promise.resolve(formattedData);
    }
    catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

async function getDataFromStripe(){
    console.log("Getting data from Stripe");
    let rows = [];
    try{
      let invoices = await getInvoices();
      for(let i = 0; i < invoices.length; i++){
        let invoice = invoices[i];
        let customer = await stripe.customers.retrieve(invoice.customer);
        if(customer.metadata && customer.metadata.coupon && customer.metadata.coupon.toUpperCase().includes("BENEFITHUB")){
          console.log("found one:", invoice.customer)
          rows.push(invoice);
        }
      }
      //console.log("Data retrieved:", rows);
      let formattedData = formatStripeData(rows);
      //console.log("Data formatted:", formattedData);
      return Promise.resolve(formattedData);
    }
    catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}
//get invoices from last month
function getInvoices(){
  return new Promise(async function(resolve, reject){
    
    try{
      let result = [];
      let start = getLastMonthStartUnix();
      let end = getThisMonthStartUnix();
      console.log("gettings all the invoices from:", start, "to:", end);
      let invoices = await stripe.invoices.list({
        limit: 100,
        status: "paid",
        created: { gte: start, lt: end}
      });
      result.push(...invoices.data);
      //console.log("first batch:", result);
      while(invoices.has_more){
        console.log("getting more invoices");
        invoices = await stripe.invoices.list({
          limit: 100,
          status: "paid",
          created: { gte: start, lt: end},
          starting_after: invoices.data[invoices.data.length - 1].id
        });
        result.push(...invoices.data);   
        //console.log("next batch:", result);   
      }
      resolve(result);
    }
    catch(err){
        reject(err);
    }
  });
}

function setWPDBConnection(){
  return new Promise(async (resolve, reject)=>{
      const connection = await mysql.createConnection({
          host: process.env.WPDBHOST,//
          user: process.env.WPDBUNAME,//
          password: process.env.WPDBPASS,//
          database: process.env.WPDBNAME,
          port: process.env.WPDBPORT
      });
      resolve(connection);
  })    
}

function formatWPDBData(data){
    let formattedData = [];
    let i = 0;
    for(i; i < data.length; i++){
        let date = data[i].payment_date;
        let url = data[i].source_url;
        let paid = data[i].payment_amount;
        let owed = (Number.parseFloat(paid) * .1).toFixed(2); // 10% of the amount
        formattedData.push({id: i, date: date, url: url, paid: paid, owed: owed});
    }
    return formattedData;
}

function formatStripeData(data){
  let formattedData = [];
  let i = 0;
  for(i; i < data.length; i++){
      let date = new Date(data[i].date * 1000).toLocaleDateString();
      let url = "https://copenotes.com";
      let paid = data[i].total / 100;
      let owed = (Number.parseFloat(paid) * .1).toFixed(2); // 10% of the amount
      formattedData.push({id: i + 1, date: date, url: url, paid: paid, owed: owed});
  }
  return formattedData;
}

//get the last months name
function getLastMonth(){
  let today = new Date();
  let lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  let month = lastMonth.toLocaleString('default', { month: 'long' });
  return month;
} 

//return the last month start in unix
function getLastMonthStartUnix(){
  let today = new Date();
  let lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  console.log(lastMonth.toLocaleDateString());
  return lastMonth.getTime() / 1000;
}

//return start of this month in unix
function getThisMonthStartUnix(){
  let today = new Date();
  let thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  console.log(thisMonth.toLocaleDateString());
  return thisMonth.getTime() / 1000;
}