const fs = require('fs');
const csv = require('csv-parser'); // Eller hvilken CSV-parser du bruker

const records = [];

fs.createReadStream('idiot.csv')
  .pipe(csv())
  .on('data', (data) => records.push(data))
  .on('end', () => {
    console.log("Rå CSV data:", records);
    for (const row of records) {
      console.log("Navn fra rad:", row.name);
    }
  });
