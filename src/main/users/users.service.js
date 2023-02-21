const pool = require("../../../config/db");

exports.findAllUsersService = async () => {
  const [users] = await pool.query("SELECT * FROM users");
  return users;
};
