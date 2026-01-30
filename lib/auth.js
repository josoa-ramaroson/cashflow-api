import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // optionally attach the decoded token to the request
    req.user = decoded;

    console.log("Authenticated");
    next(); // <— very important
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
}
