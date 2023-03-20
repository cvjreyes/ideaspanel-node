const { send } = require("../../helpers/send");
const {
  submitVoteService,
  checkIfComitteeUserAlreadyVotedIdea,
  checkIfAllVotesEmitted,
  updateVoteService,
} = require("./comiitte_votes.service");

exports.submitVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const alreadyVoted = await checkIfComitteeUserAlreadyVotedIdea(
      user_id,
      idea_id
    );
    if (alreadyVoted) {
      await updateVoteService(idea_id, user_id, vote);
    } else {
      await submitVoteService(idea_id, user_id, vote);
    }
    await checkIfAllVotesEmitted(idea_id);
    return send(res, true, "Vote successfully emitted");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
