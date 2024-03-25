"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

type DataType = {
  message: string;
  dataArray: string | undefined;
};

type TrainType = {
  Id_count: number;
  YearBuilt: number;
};

const MyPlot = dynamic(() => import("./components/PlotComponent"));

const Home = () => {
  const [data, setData] = useState<DataType>();
  useEffect(() => {
    const fetchFunction = async () => {
      fetch("/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(async (response) => {
          return setData(response);
        });
    };
    fetchFunction();
  }, []);

  if (data) {
    const dt = JSON.parse(data?.dataArray || "");
    const Y: number[] = dt.reduce((acc: number[], cur: TrainType) => {
      acc = acc && Array.isArray(acc) ? [...acc, cur.Id_count] : [];
      return acc;
    });

    const X: number[] = dt.reduce((acc: number[], cur: TrainType) => {
      acc = acc && Array.isArray(acc) ? [...acc, cur.YearBuilt] : [];
      return acc;
    });

    return (
      <section className="flex-start flex-col paddings mb-16">
        <h1>{data.message}</h1>
        <MyPlot
          data={[{ type: "bar", x: X, y: Y }]}
          layout={{ width: 1000, height: 500, title: "Casas por Ano" }}
        ></MyPlot>
      </section>
    );
  }

  return <h1>No message</h1>;
};

export default Home;
