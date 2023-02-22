var validator = require("email-validator");

const { send } = require("../../helpers/send");
const {
  getUserService,
  signupService,
  loginService,
} = require("./users.service");

exports.getUserInfo = async (req, res) => {
  const { user_id } = req;
  try {
    const user = await getUserService("id", user_id);
    if (!user) return send(res, false, "Invalid token");
    return send(res, true, user);
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
    const user = await getUserService("email", `'${email}'`);
    if (user)
      // login
      return loginService(res, email, user.id);
    // signup
    return signupService(res, email);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
