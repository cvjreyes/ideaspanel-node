const { send } = require("../../helpers/send");
const {
  submitVoteService,
  checkIfUserAlreadyVotedIdea,
} = require("./votes.service");

exports.submitVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const alreadyVoted = await checkIfUserAlreadyVotedIdea(user_id, idea_id);
    if (alreadyVoted) return send(res, true);
    console.log("alreadyVoted: ", alreadyVoted);
    const ok = await submitVoteService(idea_id, user_id, vote);
    if (ok) return send(res, true, "Vote successfully done");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
