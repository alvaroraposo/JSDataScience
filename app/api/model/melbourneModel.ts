import { readCSV, toJSON } from "danfojs-node";

(async () => {
  const df = await readCSV("../data/melb_data.csv");
  console.log(df.columns);
})();
