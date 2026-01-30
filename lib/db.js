import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export async function getDB() {
  const connection = await clientPromise;
  return connection.db("cashflow");
}
