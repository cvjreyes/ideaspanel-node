const multer = require("multer");
const {
  getUserService,
  getComitteeUsersService,
} = require("../users/users.service");
const { send } = require("../../helpers/send");
const {
  insertIdeaService,
  addImageService,
  getSomeIdeasService,
  getDraftsService,
  getIdeaService,
  updateIdeaService,
  getOldestIdeaToApproveService,
  deleteIdeaImgService,
  getDeniedService,
  getPublishedService,
  getValidatingService,
  getIdeaAndVoteService,
  getAllValidatingService,
  getPagePublishedService,
} = require("./ideas.service");
const { generateToken, saveTokenIntoDB } = require("../../helpers/token");
const { generateLink } = require("../../helpers/emails");
const { sendEmail } = require("../emails/emails.services");
const { submitVoteService, submitVoteNullService } = require("../comittee_votes/comiitte_votes.service");

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

exports.getPagePublished = async (req, res) => {
  try {
    const pages = await getPagePublishedService();
    send(res, true, pages);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getSome = async (req, res) => {
  const { page } = req.params;
  try {
    const ideas = await getSomeIdeasService(page);
    send(res, true, ideas);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.toApprove = async (req, res) => {
  const { user_id } = req.params;
  try {
    const idea = await getOldestIdeaToApproveService(user_id);
    send(res, true, idea);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getDrafts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const drafts = await getDraftsService(user_id);
    send(res, true, drafts);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getDenied = async (req, res) => {
  const { user_id } = req.params;
  try {
    const denied = await getDeniedService(user_id);
    send(res, true, denied);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getPublished = async (req, res) => {
  const { user_id } = req.params;
  try {
    const denied = await getPublishedService(user_id);
    send(res, true, denied);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getValidating = async (req, res) => {
  const { user_id } = req.params;
  try {
    const validating = await getValidatingService(user_id);
    send(res, true, validating);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getIdeaInfo = async (req, res) => {
  const { idea_id } = req.params;
  try {
    const idea = await getIdeaService(idea_id);
    send(res, true, idea);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getIdeaInfoAndVote = async (req, res) => {
  const { idea_id } = req.params;
  try {
    const user = await getUserService("email", req.email);
    const idea = await getIdeaAndVoteService(idea_id, user.id);
    send(res, true, idea);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getAllValidating = async (req, res) => {
  const user = await getUserService("email", req.email);
  try {
    const ideas = await getAllValidatingService(user.id);
    send(res, true, ideas);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.upload = async (req, res) => {
  const { form } = req.body;
  const user = await getUserService("email", req.email);
  try {
    const insertId = await insertIdeaService(user.id, form);
    send(res, true, insertId);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.uploadImage = async (req, res) => {
  const { idea_id } = req.params;
  try {
    uploadFn(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        send(res, false, err);
      } else if (err) {
        send(res, false, err);
      }
      // here we can add filename or path to the DB
      const newImage = `http://localhost:5026/images/${req.file.filename}`;
      await addImageService(idea_id, newImage);
      send(res, true);
    });
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.update = async (req, res) => {
  const { form, publish } = req.body;
  try {
    await updateIdeaService(form, publish);
    const users = await getComitteeUsersService();
    for (let i = 0; i < users.length; i++) {
      // const token = generateToken(users[i].email);
      // await saveTokenIntoDB(users[i].email, token);
      // const link = generateLink("log_in", users[i].id, token);
      // await sendEmail(
      //   users[i].email,
      //   "IdeasPanel: Comittee Idea",
      //   "comittee",
      //   link
      // );
      await submitVoteService(form.id, users[i].id, null)
    }
    send(res, true);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.deleteIdeaImg = async (req, res) => {
  const { idea_id } = req.params;
  try {
    await deleteIdeaImgService(idea_id);
    send(res, true, "testing");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
