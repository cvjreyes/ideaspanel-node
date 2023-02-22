const { send } = require("../../helpers/send");

const { getUserService } = require("./users.service");

exports.getUserInfo = async (req, res) => {
  const { user_id } = req;
  try {
    const user = await getUserService("id", user_id);
    if (!user) return send(res, false, "Invalid token");
    return send(res, true, user);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};
