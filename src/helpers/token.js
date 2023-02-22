const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { pool } = require("../../config/db");

exports.generateToken = (user_id) => {
  const token = jwt.sign({ user_id }, process.env.NODE_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  // relpace dots bc url will redirect to another page
  // exclamation is not used by algorithm so when replaced back to dots there'll be no conflicts
  return token.split(".").join("!");
};

exports.saveTokenIntoDB = async (id, token) => {
  pool.query("UPDATE users SET token = ? WHERE id = ?", [token, id]);
};
