const { generateLink } = require("../../helpers/emails");
const { send } = require("../../helpers/send");
const { generateToken, saveTokenIntoDB } = require("../../helpers/token");
const { sendEmail } = require("../emails/emails.services");

const { getUserService, createUserService } = require("./users.service");

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
    const regex = /technipenergies.com$/;
    if (!regex.exec(email))
      return send(res, false, "Your email must belong to Technip Energies");
    if (await getUserService("email", `'${email}'`)) {
      return send(res, false, "User exists");
    } else {
      const user_id = await createUserService(email);
      const token = generateToken(user_id);
      await saveTokenIntoDB(user_id, token);
      const link = generateLink("create_password", user_id, token);
      console.log(link);
      const ok = await sendEmail(
        email,
        "IdeasPanel: Request access",
        "request",
        link
      );
      if (ok) {
        return send(res, true, "User registered successfully");
      } else throw new Error("Sending email failed");
    }
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
