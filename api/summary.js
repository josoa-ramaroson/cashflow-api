import { getDB } from "../lib/db.js"
import { verifyToken } from "../lib/auth.js"

export default async function handler(req, res) {
  try {
    verifyToken(req)
    const db = await getDB()

    const result = await db.collection("transactions").aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]).toArray()

    const income = result.find(r => r._id === "income")?.total || 0
    const expense = result.find(r => r._id === "expense")?.total || 0

    res.json({
      income,
      expense,
      balance: income - expense
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}
