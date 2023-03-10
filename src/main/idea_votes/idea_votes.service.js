const pool = require("../../../config/db");

exports.getIdeaVotesService = async (idea_id) => {
  const [idea_votes] = await pool.query(
    "SELECT * FROM idea_votes WHERE idea_id = ?",
    idea_id
  );
  return idea_votes;
};

exports.checkIfUserAlreadyVotedIdeaService = async (user_id, idea_id) => {
  const [vote] = await pool.query(
    "SELECT * FROM idea_votes WHERE user_id = ? AND idea_id = ?",
    [user_id, idea_id]
  );
  return vote[0];
};

exports.submitIdeaVoteService = async (idea_id, user_id, vote) => {
  const [finalIdeaVote] = await pool.query(
    "INSERT INTO idea_votes (idea_id, user_id, approved) VALUES (?, ?, ?)",
    [idea_id, user_id, vote]
  );

  return finalIdeaVote;
};
