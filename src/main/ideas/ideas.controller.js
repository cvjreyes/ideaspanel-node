const multer = require("multer");

exports.upload = async (req, res) => {
  console.log("test");
};

const upload = multer({
  dest: "../../media",
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});
