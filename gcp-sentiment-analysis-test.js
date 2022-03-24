// Imports the Google Cloud client library
const language = require('@google-cloud/language');
const ExcelJS = require('exceljs');
const positiveInbounds = require("./inputs/positive-inbounds.json")
// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */
const text = 'Is this a question or not?';



main();

async function main(){
  try{
    let data = [];
    let promises = [];
    for(let i = 0; i < positiveInbounds.length; i++){
      const inbound = positiveInbounds[i];
      // Prepares a document, representing the provided text
      promises.push(getSentiment(inbound.inbound));
      console.log(i);
      
    }    
    Promise.all(promises).then(async function(values){
      for(let i = 0; i < values.length; i++){
        let inbound = positiveInbounds[i];
        let type = values[i];
        data.push({
          "text": inbound.text,
          "inbound": inbound.inbound,
          "manual": inbound.qualification,
          "automatic": type
        })
      }
      await createWorkbook(data);
    });
  }
  catch(err){
    console.log(err);
  }
  console.log("Done");
}

async function getSentiment(text){
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  // Detects the sentiment of the document
  const [result] = await client.analyzeSentiment({document});

  const sentiment = result.documentSentiment;
  // console.log('Document sentiment:');
  // console.log(`  Score: ${sentiment.score}`);
  // console.log(`  Magnitude: ${sentiment.magnitude}`);

  let type = "neutral";
  if(sentiment.score > 0.1 && sentiment.magnitude > 0.1){
    type = "positive";
  }
  else if(sentiment.score < -0.1 && sentiment.magnitude > 0.1){
    type = "negative";
  }
  return type;
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
  const worksheet = workbook.addWorksheet('Google NLP Test Results', {views:[{state: 'frozen', xSplit: 0, ySplit: 1}]});
  worksheet.columns = [
      { header: 'text', key: 'text' },
      { header: 'inbound', key: 'inbound' },
      { header: 'manual', key: 'manual' },
      { header: 'automatic', key: 'automatic' }
    ];
  let total = 0;
  let i = 0;
  for(i; i < data.length; i++){
      worksheet.addRow(data[i]);      
  }
  
  let sheetName = "google_nlp_test.xlsx";
  await workbook.xlsx.writeFile(sheetName);
  console.log("Workbook created");
  return sheetName;
}


