const { send } = require("../../helpers/send");
const {
  submitIdeaVoteService,
  checkIfUserAlreadyVotedIdeaService,
  getIdeaVotesService,
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
  const { user_id, idea_id } = req.body;
  try {
    const alreadyVoted = await checkIfUserAlreadyVotedIdeaService(
      user_id,
      idea_id
    );
    send(res, true, alreadyVoted);
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};

exports.submitIdeaVote = async (req, res) => {
  const { idea_id, user_id, vote } = req.body;
  try {
    const alreadyVoted = await checkIfUserAlreadyVotedIdeaService(
      user_id,
      idea_id
    );
    if (alreadyVoted) return send(res, true);
    const ok = await submitIdeaVoteService(idea_id, user_id, vote);
    if (ok) return send(res, true, "Idea vote successfully done");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
