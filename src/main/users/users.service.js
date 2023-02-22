const pool = require("../../../config/db");

exports.getUserService = async (key, value) => {
  const [user] = await pool.query(
    `SELECT * FROM users WHERE ${key} = ${value}`
  );
  return user[0];
};
