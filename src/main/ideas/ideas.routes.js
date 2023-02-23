const router = require("express").Router(),
  controller = require("./ideas.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.post("/upload", checkAuth, controller.upload);

module.exports = router;
