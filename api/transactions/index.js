import { getDB } from "../../lib/db.js"
import { verifyToken } from "../../lib/auth.js"
import { createTransaction } from "../../lib/transaction.js"

export default async function handler(req, res) {
  try {
    verifyToken(req)
    const db = await getDB()

    if (req.method === "GET") {
      const data = await db.collection("transactions").find().toArray()
      return res.json(data)
    }

    if (req.method === "POST") {
      const transaction = createTransaction(req.body)
      await db.collection("transactions").insertOne(transaction)
      return res.status(201).json(transaction)
    }

    res.status(405).end()
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}
