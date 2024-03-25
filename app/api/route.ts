import { getHousesPerYear, toJSON } from "./model/trainModel";

export async function GET() {
  const df = await getHousesPerYear();

  const data = {
    message: "Hello, Next.js!",
    dataArray: JSON.stringify(toJSON(df)),
  };
  return Response.json(data);
}
