const { send } = require("../../helpers/send");

const { findAllUsersService } = require("./users.service");

exports.findAll = async (req, res) => {
  try {
    const users = await findAllUsersService();
    return send(res, true, users);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};
