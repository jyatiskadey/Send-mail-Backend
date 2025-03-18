const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // ✅ Extract the token

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // ✅ Attach user ID to req.user
    console.log("User authenticated:", req.user); // ✅ Log for debugging
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
