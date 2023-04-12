const fs = require("fs");
require("dotenv").config();
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

exports.updateComitteeService = async (email, comittee) => {
  await pool.query("UPDATE users SET isComittee = ? WHERE email = ?", [
    comittee,
    email,
  ]);
};

exports.changeUserProfilePic = async (user_id, newImage) => {
  await pool.query("UPDATE users SET profile_pic = ? WHERE id = ?", [
    newImage,
    user_id,
  ]);
};

exports.deleteOldProfilePicService = async (profile_pic) => {
  const path = "." + profile_pic.substring(process.env.NODE_SERVER_URL.length);
  fs.unlink(path, function (err) {
    if (err) console.error(err);
    else console.info("Image deleted successfully");
  });
};
