const fs = require("fs");
const csv = require("csv-parser");

fs.createReadStream("importApplicationsFeb2025.csv")
  .pipe(csv({ separator: ";" })) // Sjekk at separatoren er riktig!
  .on("data", (row) => console.log("Parsed row:", row))
  .on("end", () => console.log("CSV-parsing fullført."));
