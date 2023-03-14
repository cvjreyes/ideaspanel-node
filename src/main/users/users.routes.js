const router = require("express").Router(),
  controller = require("./users.controller"),
  { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_all_users", checkAuth, controller.getAllUsers);

router.get("/get_comittee_users", checkAuth, controller.getComitteeUsers);

router.get("/get_user_info", checkAuth, controller.getUserInfo);

router.get("/profile/:id", checkAuth, controller.getProfileById);

router.post("/login", controller.login);

router.post("/validate_credentials", controller.validateCredentials);

router.post("/update_comittee", checkAuth, controller.updateComittee);

module.exports = router;
