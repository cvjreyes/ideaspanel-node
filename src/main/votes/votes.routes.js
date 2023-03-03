const router = require("express").Router(),
  controller = require("./votes.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.post("/submit_votes", checkAuth, controller.submitVote);

module.exports = router;
