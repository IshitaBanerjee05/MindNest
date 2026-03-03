const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;

module.exports = authMiddleware;
```

---

**What this does:**

Every time someone tries to access a note route, this middleware runs first and checks:

Request comes in
      ↓
Is there a token in the header?
      ↓
Is the token valid?
      ↓
Yes → attach userId to request → allow through
No  → reject with 401 Unauthorized
```