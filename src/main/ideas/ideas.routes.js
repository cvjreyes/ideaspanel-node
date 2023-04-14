const router = require("express").Router(),
  controller = require("./ideas.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_some", checkAuth, controller.getSome);

router.get("/to_approve/:user_id", checkAuth, controller.toApprove);

router.get("/get_profile_ideas/:user_id/:type", checkAuth, controller.getProfileIdeas);

router.get("/get_drafts/:user_id", checkAuth, controller.getDrafts);

router.get("/get_denied/:user_id", checkAuth, controller.getDenied);

router.get("/get_published/:user_id", checkAuth, controller.getPublished);

router.get("/get_validating/:user_id", checkAuth, controller.getValidating);

router.get("/get_info/:idea_id", checkAuth, controller.getIdeaInfo);

router.get(
  "/get_info_and_vote/:idea_id",
  checkAuth,
  controller.getIdeaInfoAndVote
);

router.get("/get_all_validating", checkAuth, controller.getAllValidating);

router.post("/upload", checkAuth, controller.upload);

router.post("/upload_image/:idea_id", checkAuth, controller.uploadImage);

router.post("/update", checkAuth, controller.update);

router.delete("/delete_img/:idea_id", checkAuth, controller.deleteIdeaImg);

module.exports = router;
