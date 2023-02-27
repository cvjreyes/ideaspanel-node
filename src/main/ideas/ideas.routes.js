const router = require("express").Router(),
  controller = require("./ideas.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_some/:page", checkAuth, controller.getSome);

router.get("/to_approve", checkAuth, controller.toApprove);

router.get("/get_drafts", checkAuth, controller.getDrafts);

router.get("/get_info/:idea_id", checkAuth, controller.getIdeaInfo);

router.post("/upload", checkAuth, controller.upload);

router.post("/upload_image/:idea_id", checkAuth, controller.uploadImage);

router.post("/update", checkAuth, controller.update);

module.exports = router;
