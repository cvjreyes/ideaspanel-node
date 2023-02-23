const router = require("express").Router(),
  controller = require("./users.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_user_info", checkAuth, controller.getUserInfo);

router.post("/login", controller.login);

router.post("/validate_credentials", controller.validateCredentials);

module.exports = router;
