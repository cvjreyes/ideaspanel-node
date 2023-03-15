const router = require("express").Router(),
  controller = require("./comments.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_comments_from_idea/:idea_id", checkAuth, controller.getCommentsFromIdea)

router.post("/add_comment", checkAuth, controller.addComment);

router.delete("/delete_comment/:comment_id", checkAuth, controller.deleteComment);

module.exports = router;