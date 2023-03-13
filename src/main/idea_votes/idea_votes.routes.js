const router = require("express").Router(),
  controller = require("./idea_votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_idea_votes/:idea_id", checkAuth, controller.getIdeaVotes);

router.get(
  "/check_user_idea_vote/:idea_id/:user_id",
  checkAuth,
  controller.checkIfUserAlreadyVotedIdea
);

router.post("/submit_idea_vote", checkAuth, controller.submitIdeaVote);

router.delete("/delete_idea_vote/:idea_id/:user_id", checkAuth, controller.deleteIdeaVote);

module.exports = router;
