const router = require("express").Router(),
  controller = require("./ideas.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_some/:page", checkAuth, controller.getSome);

router.post("/upload", checkAuth, controller.upload);

router.post("/upload_image/:idea_id", checkAuth, controller.uploadImage);

module.exports = router;
