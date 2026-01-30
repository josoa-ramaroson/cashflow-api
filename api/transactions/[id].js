import { ObjectId } from "mongodb"
import { getDB } from "../../lib/db.js"
import { verifyToken } from "../../lib/auth.js"

export default async function handler(req, res) {
  try {
    verifyToken(req)
    const db = await getDB()
    const { id } = req.query

    if (req.method === "PUT") {
      await db.collection("transactions").updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
      )
      return res.json({ ok: true })
    }

    if (req.method === "DELETE") {
      await db.collection("transactions").deleteOne({
        _id: new ObjectId(id)
      })
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}
