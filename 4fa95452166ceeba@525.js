function _1(md){return(
md`# hw06 Embeded PMA`
)}

function _2(Plot,width,data){return(
Plot.plot({
  width: width,
  y: {
    type: "log"
  },
  color: {legend: true},
  marks: [
    Plot.dot(data, {x: "date", y:"quantity", tip: true, stroke: "type"}),
    Plot.linearRegressionY(data, {x: "date", y: "quantity", stroke: "type"}),
    Plot.linearRegressionY(data, {x: "date", y: "quantity"})
  ]
})
)}

function _3(Plot,width,data){return(
Plot.plot({
  margin: 50,
  width: width,
  color: { legend: true },
  marks: [
    Plot.frame({ strokeOpacity: 0.1 }),
    Plot.line(data, { x: "date", y: "quantity", stroke: "building", group: "building" }),
    Plot.dot(data, { x: "date", y: "quantity", fill: "building", group: "building", tip: true }),
    Plot.ruleY([0])
  ]
})
)}

function _selectedYear(Inputs,years){return(
Inputs.select(years, {
  label: "Select a Year",
  format: d => d.toString().replace(/,/g, "")
})
)}

function _buildingEnergy(Inputs,d3,annualData){return(
Inputs.select(d3.group(annualData, d => d.building), {label: "Select a Building"})
)}

function _6(Plot,plotAnnualUsage){return(
Plot.plot(plotAnnualUsage())
)}

function _7(md){return(
md`## Implementation that enabled above graphs`
)}

function _pma(FileAttachment){return(
FileAttachment("pma@2.xlsx").xlsx()
)}

function _sheet_name(){return(
"Meter Entries"
)}

function _10(sheet){return(
sheet.filter(d => d.E == "Fuel Oil (No. 2)")
)}

function _sheet(pma,sheet_name){return(
pma.sheet(sheet_name)
)}

function _12(Inputs,sheet){return(
Inputs.table(sheet)
)}

function _data(pma,sheet_name)
{
  // Sample the columns of interest
  let data = pma.sheet(sheet_name).map(d => ({building: d.A, type: d.E, quantity: d.J, units: d.K, start: d.G, end: d.H, delivery: d.I}));

  // Set "date" to either start or delivery date (latter is used for "Fuel Oil (No. 2)"
  data.forEach(d => d.date = d.delivery == "Not Available" ? d.start : d.delivery)

  // Remove extraneous rows at the beginning of the sheet
  data = data.filter((d, i) => i > 5);

  // Verify that start and end were correctly converted to date objects
  if (Object.prototype.toString.call(data[0].start) !== "[object Date]") throw "start not converted to date";
  if (Object.prototype.toString.call(data[0].end) !== "[object Date]") throw "end not converted to date";

  return data;
}


function _14(pma,sheet_name)
{
  // Sample the columns of interest
  let data = pma.sheet(sheet_name).map(d => ({building: d.A, type: d.E, quantity: d.J, units: d.K, start: d.G, end: d.H, delivery: d.I}));

  // Set "date" to either start or delivery date (latter is used for "Fuel Oil (No. 2)"
  data.forEach(d => d.date = d.delivery == "Not Available" ? d.start : d.delivery)

  return data
}


function _15(Inputs,data){return(
Inputs.table(data)
)}

function _buildings(data){return(
[...new Set(data.map(d => d.building))]
)}

function _units(data){return(
Array.from(new Set(data.map(d => d.units)))
)}

function _types(data){return(
Array.from(new Set(data.map(d => d.type)))
)}

function _years(totalEnergy){return(
[...new Set(totalEnergy.map(d => d.date.getFullYear()))]
)}

function _totalEnergy(pma)
{
  let data = pma.sheet("Meter Entries").map(d => ({
  building: d.A,
  type: d.E,
  quantity: d.J,
  units: d.K,
  start: d.G,
  end: d.H,
  delivery: d.I
}));

data.forEach(d => d.date = d.delivery == "Not Available" ? d.start : d.delivery);

data = data.filter((d, i) => i >= 6);

if (Object.prototype.toString.call(data[0].start) !== "[object Date]") throw "start not converted to date";
if (Object.prototype.toString.call(data[0].end) !== "[object Date]") throw "end not converted to date";

let aggregateMap = {};

data.forEach(d => {
  let dateKey = d.date.toISOString();

  if (!aggregateMap[dateKey]) {
    aggregateMap[dateKey] = { ...d };
  } else {
    aggregateMap[dateKey].quantity += +d.quantity;
  }
});

for (let key in aggregateMap) {
  aggregateMap[key].type = "Total Energy";
}

data = Object.values(aggregateMap);

data.sort((a, b) => a.date - b.date);

  return data;
}


function _annualData(totalEnergy,selectedYear){return(
totalEnergy.filter(d => d.date.getFullYear() === selectedYear)
)}

function _plotAnnualUsage(width,Plot,buildingEnergy,d3){return(
function() {
  return {
    margin: 50,
    width: width,
    height: width/2,
    marks: [
      Plot.frame({ strokeOpacity: 0.1 }),
      Plot.line(buildingEnergy, Plot.binX({y: "sum"}, {
        x: "date",
        y: "quantity",
        tip: true,
        stroke: "red",
        thresholds: d3.utcMonth,
      })),
      Plot.linearRegressionY(buildingEnergy, Plot.binX({y: "sum"}, {
        x: "date",
        y: "quantity",
        stroke: "lightblue",
        thresholds: d3.utcMonth,
      }))
    ],
  };
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["pma@2.xlsx", {url: new URL("./files/9399067af75527be6dfd0bfa6ffdbef2a77e1fc0f8a41964e11261f40ec09351a4b394f548b4d5690d69c0a931c52aa86c64cc27f4d28977091e59d2567e2e20.xlsx", import.meta.url), mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","data"], _2);
  main.variable(observer()).define(["Plot","width","data"], _3);
  main.variable(observer("viewof selectedYear")).define("viewof selectedYear", ["Inputs","years"], _selectedYear);
  main.variable(observer("selectedYear")).define("selectedYear", ["Generators", "viewof selectedYear"], (G, _) => G.input(_));
  main.variable(observer("viewof buildingEnergy")).define("viewof buildingEnergy", ["Inputs","d3","annualData"], _buildingEnergy);
  main.variable(observer("buildingEnergy")).define("buildingEnergy", ["Generators", "viewof buildingEnergy"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plotAnnualUsage"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("pma")).define("pma", ["FileAttachment"], _pma);
  main.variable(observer("sheet_name")).define("sheet_name", _sheet_name);
  main.variable(observer()).define(["sheet"], _10);
  main.variable(observer("sheet")).define("sheet", ["pma","sheet_name"], _sheet);
  main.variable(observer()).define(["Inputs","sheet"], _12);
  main.variable(observer("data")).define("data", ["pma","sheet_name"], _data);
  main.variable(observer()).define(["pma","sheet_name"], _14);
  main.variable(observer()).define(["Inputs","data"], _15);
  main.variable(observer("buildings")).define("buildings", ["data"], _buildings);
  main.variable(observer("units")).define("units", ["data"], _units);
  main.variable(observer("types")).define("types", ["data"], _types);
  main.variable(observer("years")).define("years", ["totalEnergy"], _years);
  main.variable(observer("totalEnergy")).define("totalEnergy", ["pma"], _totalEnergy);
  main.variable(observer("annualData")).define("annualData", ["totalEnergy","selectedYear"], _annualData);
  main.variable(observer("plotAnnualUsage")).define("plotAnnualUsage", ["width","Plot","buildingEnergy","d3"], _plotAnnualUsage);
  return main;
}
