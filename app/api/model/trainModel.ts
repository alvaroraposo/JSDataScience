import { readCSV, toJSON } from "danfojs-node";

const getHousesPerYear = async () => {
  const df = await readCSV("./app/api/data/train.csv");

  const subDf = df
    ?.loc({ columns: ["Id", "YearBuilt"] })
    .groupby(["YearBuilt"])
    .count()
    .sortValues("YearBuilt", { ascending: true });

  return toJSON(subDf);
};

export { getHousesPerYear };
