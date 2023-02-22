const router = require("express").Router(),
  controller = require("./users.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_user_info", checkAuth, controller.getUserInfo);

router.post("/login", controller.login);

module.exports = router;
