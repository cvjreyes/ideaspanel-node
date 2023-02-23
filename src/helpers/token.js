const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { pool } = require("../../config/db");

exports.generateToken = (email) => {
  const token = jwt.sign({ email }, process.env.NODE_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  // relpace dots bc url will redirect to another page
  // exclamation is not used by algorithm so when replaced back to dots there'll be no conflicts
  return token.split(".").join("!");
};

exports.saveTokenIntoDB = async (email, token) => {
  pool.query("UPDATE users SET token = ? WHERE email = ?", [token, email]);
};

exports.validateToken = async (user_id, token) => {
  const pPool = pool.promise();
  const [result] = await pPool.query(
    "SELECT * FROM users WHERE id = ? AND token = ?",
    [user_id, token]
  );
  if (!result[0]) return false;
  let verifyToken = token.split("!").join(".");
  const test = jwt.verify(verifyToken, process.env.NODE_TOKEN_SECRET, (err) => {
    if (err) return false;
    return true;
  });
  return test;
};
