import dfd from "danfojs-node";
import tfjs from "@tensorflow/tfjs-node";
import sk from "scikitjs";

const getHousesPerYear = async (path: string | null | undefined = null) => {
  const df = await dfd.readCSV(path || "./app/api/data/train.csv");

  const subDf = df
    ?.loc({ columns: ["Id", "YearBuilt"] })
    .groupby(["YearBuilt"])
    .count()
    .sortValues("YearBuilt", { ascending: true });

  return dfd.toJSON(subDf);
};

(async () => {
  sk.setBackend(tfjs);
  let train_data = await dfd.readCSV("../data/train.csv");
  train_data = train_data.dropNa({ axis: 1 });

  const y = train_data.SalePrice;
  const train_features = [
    "LotArea",
    "1stFlrSF",
    "2ndFlrSF",
    "FullBath",
    "BedroomAbvGr",
    "TotRmsAbvGrd",
  ];

  const x = train_data.loc({ columns: train_features });
  const train_model = new sk.DecisionTreeRegressor();
  train_model.fit(x, y);

  const xHeadArray = await x.head().tensor.array();
  x.head().print();
  console.log(train_model.predict(xHeadArray));
})();

export { getHousesPerYear };
