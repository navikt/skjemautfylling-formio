// const sanityJson = require("./sanity.json");
const soknadsobjekter = require("./soknadsobjekter.json");
const soknadogvedlegg = require("./soknadogvedlegg.json");

const fs = require("fs");

const fyllutList = [];
fs.readdirSync("./forms").forEach((file) => {
  const fileData = fs.readFileSync(`./forms/${file}`);
  const json = JSON.parse(fileData.toString());
  fyllutList.push(json);
});

const fyllut = fyllutList.map((skjema) => skjema.properties.skjemanummer);

// const sanity = sanityJson.Skjemaer.filter((skjema) => skjema.Skjemanummer.includes("NAV")).map(
//   (skjema) => skjema.Skjemanummer
// );

// const notInFyllut = sanity.filter(
//   (sanitySkjemanummer) => !fyllut.some((fyllutSkjemanummer) => sanitySkjemanummer.trim() === fyllutSkjemanummer.trim())
// );

// const notInSanity = fyllut.filter(
//   (fyllutSkjemanummer) => !sanity.some((sanitySkjemanummer) => sanitySkjemanummer.trim() === fyllutSkjemanummer.trim())
// );

const relevantSoknadsObjekter = soknadsobjekter.soknadsobjekter
  .filter((objekt) => objekt.dokumentinnsending === "JA")
  .map((x) => x.hovedskjema)
  .sort((a, b) => a.localeCompare(b));

const soknaderNotInFyllut = Array.from(
  new Set(
    relevantSoknadsObjekter.filter(
      (soknadsobjekt) => !fyllut.some((fyllutSkjemanummer) => soknadsobjekt.trim() === fyllutSkjemanummer.trim())
    )
  )
);

const result = soknadogvedlegg.skjemaerogvedlegg.reduce((acc, curr) => {
  if (!curr.skjemanummer) return acc;
  if (!soknaderNotInFyllut.includes(curr.skjemanummer.trim())) return acc;

  const key = `${curr.skjemanummer} - ${curr.soknadsobjekt}`;
  if (acc[key]) {
    acc[key].vedlegg.push(curr.vedleggsID);
  } else {
    acc[key] = { vedlegg: [curr.vedleggsID] };
  }
  return acc;
}, {});

console.log(result);
console.log(Object.keys(result).length);
