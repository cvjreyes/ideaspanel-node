const { send } = require("../../helpers/send");
const {
  submitComitteeVoteService,
  checkIfComitteeUserAlreadyVotedIdea,
} = require("./comiitte_votes.service");

exports.submitComitteeVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const alreadyVoted = await checkIfComitteeUserAlreadyVotedIdea(user_id, idea_id);
    if (alreadyVoted) return send(res, true);
    const ok = await submitComitteeVoteService(idea_id, user_id, vote);
    if (ok) return send(res, true, "Comittee vote successfully done");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
