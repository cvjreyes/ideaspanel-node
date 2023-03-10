const pool = require("../../../config/db");

exports.checkIfComitteeUserAlreadyVotedIdea = async (user_id, idea_id) => {
  const [comitteVote] = await pool.query(
    "SELECT * FROM comittee_votes WHERE user_id = ? AND idea_id = ?",
    [user_id, idea_id]
  );
  return comitteVote[0];
};

exports.submitComitteeVoteService = async (idea_id, user_id, vote) => {
  const [finalComitteeVote] = await pool.query(
    "INSERT INTO comittee_votes (idea_id, user_id, approved) VALUES (?, ?, ?)",
    [idea_id, user_id, vote]
  );

  return finalComitteeVote;
};
