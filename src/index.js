import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { getDB } from "../lib/db.js"
import { verifyToken } from "../lib/auth.js"
import { createTransaction } from "../lib/transaction.js"
import cors from "cors";


dotenv.config()

const app = express()
app.use(express.json())
// Enable CORS for all origins
app.use(cors());

/* ------------------ AUTH ------------------ */
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body
  if (
    username === process.env.USERNAME &&
    password === process.env.PASSWORD
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "12h"
    })
    return res.json({ token })
  }
  res.status(401).json({ error: "Invalid credentials" })
})

/* ------------------ TRANSACTIONS ------------------ */
app.get("/transactions", verifyToken, async (req, res) => {
  const db = await getDB()
  const data = await db.collection("transactions").find().toArray()
  res.json(data)
})

app.post("/transactions", verifyToken, async (req, res) => {
  const db = await getDB()
  const transaction = createTransaction(req.body)
  await db.collection("transactions").insertOne(transaction)
  res.status(201).json(transaction)
})

app.put("/transactions/:id", verifyToken, async (req, res) => {
  const db = await getDB();
  const { id } = req.params;

  const { value: updatedTransaction } = await db.collection("transactions").findOneAndUpdate(
    { _id: new (await import("mongodb")).ObjectId(id) },
    { $set: req.body },
    { returnDocument: "after" } // returns the updated document
  );

  res.json(updatedTransaction);
});

app.delete("/transactions/:id", verifyToken, async (req, res) => {
  const db = await getDB()
  const { id } = req.params
  await db.collection("transactions").deleteOne({
    _id: new (await import("mongodb")).ObjectId(id)
  })
  res.json({ ok: true })
})

/* ------------------ SUMMARY ------------------ */
app.get("/summary", verifyToken, async (req, res) => {
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

  res.json({ income, expense, balance: income - expense })
})

export default app
