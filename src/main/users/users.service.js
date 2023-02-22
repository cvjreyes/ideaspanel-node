const pool = require("../../../config/db");
const { generateLink } = require("../../helpers/emails");
const { send } = require("../../helpers/send");
const { generateToken, saveTokenIntoDB } = require("../../helpers/token");
const { getName } = require("../../helpers/users");
const { sendEmail } = require("../emails/emails.services");

exports.getUserService = async (key, value) => {
  const [user] = await pool.query(
    `SELECT * FROM users WHERE ${key} = ${value}`
  );
  return user[0];
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
  const user_id = await this.createUserService(email);
  const token = generateToken("id", user_id);
  await saveTokenIntoDB(user_id, token);
  const link = generateLink("create_password", user_id, token);
  const ok = await sendEmail(
    email,
    "IdeasPanel: Request access",
    "request",
    link
  );
  if (ok) {
    return send(res, true, "User registered successfully");
  } else throw new Error("Sending email failed");
};

exports.loginService = async (res, email) => {
  try {
    // create token
    const token = generateToken("email", email);
    console.log(token);
    // create link
    // send email
    return send(res, true, "Please, check your email to log in");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
  send(res, true, "getting there");
};
