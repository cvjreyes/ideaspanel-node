const { send } = require("../../helpers/send");
const {
  submitIdeaVoteService,
  checkIfUserAlreadyVotedIdeaService,
  getIdeaVotesService,
  deleteIdeaVoteService,
} = require("./idea_votes.service");

exports.getIdeaVotes = async (req, res) => {
  const { idea_id } = req.params;
  try {
    const idea_votes = await getIdeaVotesService(idea_id);
    send(res, true, idea_votes);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.checkIfUserAlreadyVotedIdea = async (req, res) => {
  const { user_id, idea_id } = req.params;
  try {
    const alreadyVoted = await checkIfUserAlreadyVotedIdeaService(
      user_id,
      idea_id
    );
    if (alreadyVoted.length > 0) return send(res, true, alreadyVoted);
    send(res, false, alreadyVoted);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.submitIdeaVote = async (req, res) => {
  const { idea_id, user_id } = req.body;
  try {
    const ok = await submitIdeaVoteService(idea_id, user_id);
    if (ok) return send(res, true, "Idea vote successfully done");
    send(res, false, "Idea vote error");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.deleteIdeaVote = async (req, res) => {
  const { idea_id, user_id } = req.params;
  try {
    await deleteIdeaVoteService(idea_id, user_id);
    return send(res, true);
  } catch (err) {
    console.error(err);
    return send(res, false, err);
  }
};
