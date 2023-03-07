const { send } = require("../../helpers/send");
const { submitVoteService } = require("./votes.service");

exports.submitVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const ok = await submitVoteService(idea_id, user_id, vote);
    if(ok) return send(res, true, "Vote successfully done");
    return send(res, false, "Stop inventing");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
