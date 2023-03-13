const pool = require("../../../config/db");

exports.getIdeaVotesService = async (idea_id) => {
  const [idea_votes] = await pool.query(
    "SELECT * FROM idea_votes WHERE idea_id = ?",
    idea_id
  );
  return idea_votes;
};

exports.submitIdeaVoteService = async (idea_id, user_id) => {
  const [finalIdeaVote] = await pool.query(
    "INSERT INTO idea_votes (idea_id, user_id) VALUES (?, ?)",
    [idea_id, user_id]
  );
  return finalIdeaVote;
};

exports.deleteIdeaVoteService = async (idea_id, user_id) => {
  const [deleteIdeaVote] = await pool.query(
    "DELETE FROM idea_votes WHERE idea_id = ? AND user_id = ?",
    [idea_id, user_id]
  );

  return deleteIdeaVote;
};
