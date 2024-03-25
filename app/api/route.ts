import { getHousesPerYear } from "./model/trainModel";

export async function GET() {
  const df = await getHousesPerYear();

  const data = {
    message: "Hello, Next.js!",
    dataArray: JSON.stringify(df),
  };
  return Response.json(data);
}
