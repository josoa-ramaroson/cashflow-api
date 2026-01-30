import jwt from "jsonwebtoken"

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { username, password } = req.body

  if (
    username === process.env.USERNAME &&
    password === process.env.PASSWORD
  ) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.json({ token })
  }

  res.status(401).json({ error: "Invalid credentials" })
}
