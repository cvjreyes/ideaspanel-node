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

exports.getProfileById = async (id) => {
  const [profile] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    id
  );
  console.log("profile: ", profile);
  return profile;
};

exports.createUserService = async (email) => {
  const [created] = await pool.query(
    "INSERT INTO users (email, name) VALUES (?, ?)",
    [email, getName(email)]
  );
  return created.insertId;
};

exports.signupService = async (res, email) => {
  const regex = /technipenergies.com$/;
  if (!regex.exec(email))
    return send(res, false, "Your email must belong to Technip Energies");
  return await this.createUserService(email);
};
