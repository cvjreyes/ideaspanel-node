const pool = require("../../../config/db");
const { send } = require("../../helpers/send");
const { getName } = require("../../helpers/users");

exports.getUserService = async (key, value) => {
  const [user] = await pool.query(
    `SELECT * FROM users WHERE ${key} = ?`,
    value
  );
  return user[0];
};

// exports.getUserIdeaService = async (user_id) => {
//   const [user] = await pool.query(
//     `SELECT users.* FROM users JOIN ideas ON users.id = ideas.user_id WHERE ideas.user_id = ${user_id} LIMIT 1`);
//   return user;
// };

// exports.getUserIdeaService = async (user_id) => {
//   const [user] = await pool.query(
//     `SELECT users.* FROM users JOIN ideas ON users.id = ideas.user_id WHERE ideas.user_id = ? LIMIT 1`, user_id);
//   return user;
// };

exports.getAllUsersService = async () => {
  const [user] = await pool.query(
    "SELECT users.* FROM users JOIN ideas ON users.id = ideas.user_id"
  );
  return user;
};

exports.createUserService = async (email) => {
  const [created] = await pool.query(
    "INSERT INTO users (email, name, profile_pic) VALUES (?, ?, ?)",
    [email, getName(email), `${process.env.NODE_SERVER_URL}/images/default.png`]
  );
  return created.insertId;
};

exports.signupService = async (res, email) => {
  const regex = /technipenergies.com$/;
  if (!regex.exec(email))
    return send(res, false, "Your email must belong to Technip Energies");
  return await this.createUserService(email);
};
