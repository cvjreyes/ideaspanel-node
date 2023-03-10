const router = require("express").Router(),
  controller = require("./comments.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_comments_from_idea/:idea_id", checkAuth, controller.getCommentsFromIdea)

router.post("/add_comment", checkAuth, controller.addComment);

module.exports = router;