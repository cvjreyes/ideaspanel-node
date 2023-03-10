const router = require("express").Router(),
  controller = require("./idea_votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_idea_votes/:idea_id", checkAuth, controller.getIdeaVotes);

router.get("/check_user_idea_vote", checkAuth, controller.checkIfUserAlreadyVotedIdea);

router.post("/submit_idea_vote", checkAuth, controller.submitIdeaVote);

module.exports = router;
