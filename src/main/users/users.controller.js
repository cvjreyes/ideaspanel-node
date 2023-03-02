var validator = require("email-validator");
const { generateLink } = require("../../helpers/emails");

const { send } = require("../../helpers/send");
const {
  generateToken,
  saveTokenIntoDB,
  validateToken,
} = require("../../helpers/token");
const { sendEmail } = require("../emails/emails.services");
const {
  getUserService,
  signupService,
  getAllUsersService,
  getUserIdeaService,
} = require("./users.service");

exports.getUserInfo = async (req, res) => {
  const { email } = req;
  try {
    if (!email) return send(res, false, "Invalid token");
    const user = await getUserService("email", email);
    if (!user) return send(res, false, "Invalid token");
    return send(res, true, user);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

// exports.getUserIdeaInfo = async (req, res) => {
//   const { user_id } = req
//   try {
//     const user = await getUserIdeaService(user_id);
//     return send(res, true, user);
//   } catch (err) {
//     console.error(err);
//     return send(res, false, err);
//   }
// };

exports.getAllUsersInfo = async (req, res) => {
  try {
    const user = await getAllUsersService();
    return send(res, true, user);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

exports.getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await getUserService("id", id);
    return send(res, true, profile);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return send(res, false, "Please, fill all fields");
    const validatedEmail = validator.validate(email);
    if (!validatedEmail) return send(res, false, "Invalid credentials");
    const user = await getUserService("email", email);
    const user_id = !user ? await signupService(res, email) : user.id;
    const token = generateToken(email);
    await saveTokenIntoDB(email, token);
    const link = generateLink("log_in", user_id, token);
    const ok = await sendEmail(email, "IdeasPanel: Log In", "login", link);
    if (ok) {
      return send(res, true, `User ${email} registered successfully`);
    } else throw new Error("Sending email failed");
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

exports.validateCredentials = async (req, res) => {
  const { user_id, token } = req.body;
  try {
    const user = await getUserService("id", user_id);
    if (!user) return send(res, false, "Link invalid");
    const validated = await validateToken(user_id, token);
    return send(res, validated, !validated ? "Invalid credentials" : user);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
