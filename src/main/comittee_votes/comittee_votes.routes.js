const router = require("express").Router(),
  controller = require("./comittee_votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.post("/submit_vote", checkAuth, controller.submitVote);

module.exports = router;
