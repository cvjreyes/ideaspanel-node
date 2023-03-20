const { send } = require("../../helpers/send");
const { getSentToValidate } = require("../ideas/ideas.service");
const {
  submitVoteService,
  checkIfComitteeUserAlreadyVotedIdea,
  checkIfAllVotesEmitted,
  updateVoteService,
  deleteComitteeVotesService,
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

exports.submitComitteeVotes = async (req, res) => {
  const { user_id } = req.body;
  try {
    const ideasSentToValidate = await getSentToValidate();
    for (let i = 0; i < ideasSentToValidate.length; i++) {
      const idea_id = ideasSentToValidate[i].id;
      await submitVoteService(idea_id, user_id, null);
    }
    send(res, true, "Vote successfully emitted");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.deleteComitteeVotes = async (req, res) => {
  const { user_id } = req.params;
  try {
    await deleteComitteeVotesService(user_id);
    send(res, true, "Votes deleted from user");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
