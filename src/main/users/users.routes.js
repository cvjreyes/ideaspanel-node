const router = require("express").Router(),
  controller = require("./users.controller");
// { checkAuth } = require("../../middlewares/checkAuth");

router.get("/get_all", controller.findAll);

module.exports = router;
