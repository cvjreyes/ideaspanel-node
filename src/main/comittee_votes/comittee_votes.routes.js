const router = require("express").Router(),
  controller = require("./comittee_votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.post("/submit_comittee_votes", checkAuth, controller.submitComitteeVote);

module.exports = router;
