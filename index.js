import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 4000;

// middle ware -> Intercept ->converting body to json
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected  ✌️😊");
  return client;
}
app.get("/", (request, response) => {
  response.send("hello sathishkumar venkatesan Datas => ,/income ,/expense ,/incomebymonth ,/expensebymonth ");
});
app.get("/income", async function (request, response) {
  const moneydata = await client
    .db("moneyapp")
    .collection("income")
    .find({})
    .toArray();
  response.send(moneydata);
});

app.post("/add-income", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client
    .db("moneyapp")
    .collection("income")
    .insertOne(data);
  response.send(data);
});

app.get("/expense", async (request, response) => {
  const result = await client
    .db("moneyapp")
    .collection("expense")
    .find({})
    .toArray();
  response.send(result);
});

app.post("/add-expense", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client
    .db("moneyapp")
    .collection("expense")
    .insertOne(data);
  response.send(data);
});

app.post("/incomebymonth", async (request, response) => {
  const { month } = request.body;
  // console.log(data);

  const moneydata = await client
    .db("moneyapp")
    .collection("income")
    .find({ month: month })
    .toArray();
  response.send(moneydata);
});

app.post("/expensebymonth", async (request, response) => {
  const { month } = request.body;
  // console.log(data);

  const moneydata = await client
    .db("moneyapp")
    .collection("expense")
    .find({ month: month })
    .toArray();
  response.send(moneydata);
});

export const client = await createConnection();

app.listen(PORT, () => console.log(`server started in ${PORT}`));
