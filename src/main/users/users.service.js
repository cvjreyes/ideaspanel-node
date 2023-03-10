const pool = require("../../../config/db");
const { send } = require("../../helpers/send");
const { getName } = require("../../helpers/users");

exports.getAllUsersService = async () => {
  const [users] = await pool.query("SELECT * FROM users");
  return users;
};

exports.getComitteeUsersService = async () => {
  const [users] = await pool.query("SELECT * FROM users WHERE isComittee = 1");
  return users;
};

exports.getUserService = async (key, value) => {
  const [user] = await pool.query(
    `SELECT * FROM users WHERE ${key} = ?`,
    value
  );
  return user[0];
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

exports.updateAdminService = async (email, admin) => {
  await pool.query("UPDATE users SET isAdmin = ? WHERE email = ?", [
    admin,
    email,
  ]);
};
