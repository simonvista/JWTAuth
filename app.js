const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to API",
  });
});
// verifyToken is middleware
function verifyToken(req, res, next) {
  // Get auth header value
  // Token Format: Authorization: Bearer <access_token>
  const bearerHeader = req.headers["authorization"];
  // Check if it isn't undefined
  if (typeof bearerHeader !== "undefined") {
    //  Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set token
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
// Create protected route
app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "whateversecretkey", (err, authData) => {
    if (err) res.sendStatus(403);
    res.json({
      message: "Post created",
      authData,
    });
  });
});
// Create token for the above protected route
app.post("/api/login", (req, res) => {
  // Mock User
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };
  // Issue access token after login
  jwt.sign(
    { user },
    "whateversecretkey",
    { expiresIn: "30s" },
    async (err, token) => {
      res.json({ token });
    }
  );
});
app.listen(5000, () => console.log("Server is running on port 5000"));
