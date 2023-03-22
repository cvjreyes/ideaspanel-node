var validator = require("email-validator");
const multer = require("multer");
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
  getComitteeUsersService,
  updateComitteeService,
  getAllUsersService,
  changeUserProfilePic,
  deleteOldProfilePicService,
} = require("./users.service");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadFn = multer({
  storage: storage,
  limits: { fieldSize: "256mb" },
}).single("file");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return send(res, true, users);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

exports.getComitteeUsers = async (req, res) => {
  try {
    const users = await getComitteeUsersService();
    return send(res, true, users);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};

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

exports.updateComittee = async (req, res) => {
  const { email, comittee } = req.body;
  try {
    await updateComitteeService(email, comittee);
    send(res, true);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.editProfilePic = async (req, res) => {
  const { user_id } = req.params;
  const { profile_pic } = await getUserService("id", user_id);
  try {
    uploadFn(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        send(res, false, err);
      } else if (err) {
        send(res, false, err);
      }
      const newImage = `http://localhost:5026/images/${req.file.filename}`;
      await changeUserProfilePic(user_id, newImage);
      if (!profile_pic.includes("default.png")) {
        await deleteOldProfilePicService(profile_pic);
      }
      send(res, true, "Image updated successfully");
    });
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
