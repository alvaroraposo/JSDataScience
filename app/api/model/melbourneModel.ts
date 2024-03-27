import dfd from "danfojs-node";
import tfjs from "@tensorflow/tfjs-node";
import sk from "scikitjs";

const getXY = async () => {
  let melbourne_data = await dfd.readCSV("../data/melb_data.csv");
  melbourne_data = melbourne_data.dropNa({ axis: 1 });

  const y = melbourne_data.Price;
  const melbourne_features = [
    "Rooms",
    "Bathroom",
    "Landsize",
    "Lattitude",
    "Longtitude",
  ];

  const x = melbourne_data.loc({ columns: melbourne_features });

  return [x, y];
};
const firstMLModel = async () => {
  const [x, y] = await getXY();

  const melbourne_model = new sk.DecisionTreeRegressor();
  melbourne_model.fit(x, y);

  const xHeadArray = await x.head().tensor.array();
  //x.head().print();
  console.log(melbourne_model.predict(xHeadArray));
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
  const melbourne_model = new sk.DecisionTreeRegressor();
  melbourne_model.fit(trainX, trainY);

  const predictedHomePrices = melbourne_model.predict(valX);

  console.log(sk.metrics.meanAbsoluteError(valY, predictedHomePrices));
};

(async () => {
  sk.setBackend(tfjs);
  await modelValidation();
})();
