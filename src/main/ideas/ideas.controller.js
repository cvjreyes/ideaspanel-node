const multer = require("multer");
const { getUserService } = require("../users/users.service");
const { send } = require("../../helpers/send");
const {
  insertIdeaService,
  addImageService,
  getSomeIdeasService,
  getDraftsService,
  getIdeaService,
} = require("./ideas.service");

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
  try {
    const idea = await getOldestIdeaToApproveService();
    send(res, true, idea);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.getDrafts = async (req, res) => {
  const { email } = req;
  try {
    const user = await getUserService("email", email);
    const drafts = await getDraftsService(user.id);
    send(res, true, drafts);
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
