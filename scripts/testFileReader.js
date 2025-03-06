const fs = require("fs");

fs.readFile("importApplicationsFeb2025.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Feil ved lesing av CSV-filen:", err);
    return;
  }
  console.log("Innhold i CSV-filen:\n", JSON.stringify(data));
});
