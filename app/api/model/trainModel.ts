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

const getXY = async () => {
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

  return [x, y];
};

const firstMLModel = async () => {
  const [x, y] = await getXY();
  const train_model = new sk.DecisionTreeRegressor();
  train_model.fit(x, y);

  const xHeadArray = await x.head().tensor.array();
  x.head().print();
  console.log(train_model.predict(xHeadArray));
};

const modelValidation = async () => {
  const [x, y] = await getXY();
  const xArray = await x.tensor.array();
  const yArray = await y.tensor.array();
  const [trainX, valX, trainY, valY] = sk.trainTestSplit(
    xArray,
    yArray,
    undefined,
    undefined,
    1
  );
  const trainModel = new sk.DecisionTreeRegressor();
  trainModel.fit(trainX, trainY);

  const predictedHomePrices = trainModel.predict(valX);

  console.log(sk.metrics.meanAbsoluteError(valY, predictedHomePrices));
};

(async () => {
  sk.setBackend(tfjs);
  await modelValidation();
})();

export { getHousesPerYear };
