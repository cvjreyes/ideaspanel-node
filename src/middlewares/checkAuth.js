const jwt = require("jsonwebtoken");
const { send } = require("../helpers/send");
require("dotenv").config();

exports.checkAuth = (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) return send(res, false, "Unauthorized");
  const verifyToken = token.split("!").join(".");
  jwt.verify(verifyToken, process.env.NODE_TOKEN_SECRET, (err, user) => {
    if (err) return send(res, false, "Invalid token");
    req.email = user.email;
    next();
  });
};
