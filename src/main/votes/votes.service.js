const pool = require("../../../config/db");

exports.submitVoteService = async (idea_id, user_id, vote) => {
  const [finalVote] = await pool.query(
    "INSERT INTO votes (idea_id, user_id, approved) VALUES (?, ?, ?)",
    [idea_id, user_id, vote]
  );
  
  return finalVote;
};
