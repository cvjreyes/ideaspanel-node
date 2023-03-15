const { send } = require("../../helpers/send");
const {
  submitVoteService,
  checkIfComitteeUserAlreadyVotedIdea,
  checkIfAllVotesEmitted,
} = require("./comiitte_votes.service");

exports.submitVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const alreadyVoted = await checkIfComitteeUserAlreadyVotedIdea(
      user_id,
      idea_id
    );
    if (alreadyVoted) return send(res, true);
    await submitVoteService(idea_id, user_id, vote);
    await checkIfAllVotesEmitted(idea_id);
    return send(res, true, "Vote successfully emitted");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
