const router = require("express").Router(),
  controller = require("./comittee_votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.post("/submit_vote", checkAuth, controller.submitVote);

router.post(
  "/submit_comittee_votes",
  checkAuth,
  controller.submitComitteeVotes
);

router.delete(
  "/delete_comittee_votes/:user_id",
  checkAuth,
  controller.deleteComitteeVotes
);

module.exports = router;
