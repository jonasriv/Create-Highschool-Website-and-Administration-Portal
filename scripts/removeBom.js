const fs = require("fs");
const csv = require("csv-parser");

fs.readFile("importApplicationsFeb2025.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Feil ved lesing av CSV-filen:", err);
    return;
  }

  // Fjern BOM om den finnes
  if (data.charCodeAt(0) === 0xFEFF) {
    data = data.slice(1);
  }

  // Lagre filen uten BOM
  fs.writeFileSync("importApplicationsFeb2025.csv", data, "utf8");

  console.log("BOM fjernet! Prøv skriptet på nytt.");
});
