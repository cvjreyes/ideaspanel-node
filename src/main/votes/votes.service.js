const pool = require("../../../config/db");

exports.checkIfUserAlreadyVotedIdea = async (user_id, idea_id) => {
  const [vote] = await pool.query(
    "SELECT * FROM votes WHERE user_id = ? AND idea_id = ?",
    [user_id, idea_id]
  );
  return vote[0];
};

exports.submitVoteService = async (idea_id, user_id, vote) => {
  const [finalVote] = await pool.query(
    "INSERT INTO votes (idea_id, user_id, approved) VALUES (?, ?, ?)",
    [idea_id, user_id, vote]
  );

  return finalVote;
};
