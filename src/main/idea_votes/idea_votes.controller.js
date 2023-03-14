const { send } = require("../../helpers/send");
const {
  submitIdeaVoteService,
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

exports.submitIdeaVote = async (req, res) => {
  const { idea_id, user_id, check_vote } = req.body;
  try {
    if (check_vote) {
      const ok = await deleteIdeaVoteService(idea_id, user_id);
      if (ok) return send(res, true, "Idea successfully deleted");
      send(res, false, "Idea vote error");
    } else {
      const ok = await submitIdeaVoteService(idea_id, user_id);
      if (ok) return send(res, true, "Idea vote successfully done");
      send(res, false, "Idea vote error");
    }
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
