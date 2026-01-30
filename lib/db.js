import { MongoClient } from "mongodb"

let client
let clientPromise

if (!clientPromise) {
  client = new MongoClient(process.env.MONGODB_URI)
  clientPromise = client.connect()
}

export async function getDB() {
  const client = await clientPromise
  return client.db("cashflow")
}
