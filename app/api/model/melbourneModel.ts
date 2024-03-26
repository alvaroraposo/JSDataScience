import dfd from "danfojs-node";
import tfjs from "@tensorflow/tfjs-node";
import sk from "scikitjs";

(async () => {
  sk.setBackend(tfjs);
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
  const melbourne_model = new sk.DecisionTreeRegressor();
  melbourne_model.fit(x, y);

  const xHeadArray = await x.head().tensor.array();
  x.head().print();
  console.log(melbourne_model.predict(xHeadArray));
})();
