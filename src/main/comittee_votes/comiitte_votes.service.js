const pool = require("../../../config/db");

exports.checkIfComitteeUserAlreadyVotedIdea = async (user_id, idea_id) => {
  const [comitteVote] = await pool.query(
    "SELECT * FROM comittee_votes WHERE user_id = ? AND idea_id = ?",
    [user_id, idea_id]
  );
  return comitteVote[0];
};

exports.submitVoteService = async (idea_id, user_id, vote) => {
  await pool.query(
    "INSERT INTO comittee_votes (idea_id, user_id, approved) VALUES (?, ?, ?)",
    [idea_id, user_id, vote]
  );
};

exports.countPositiveVotes = async (idea_id) => {
  const [positiveVotes] = await pool.query(
    "SELECT COUNT(*) as 'total' FROM comittee_votes WHERE approved = 1 AND idea_id = ? ",
    idea_id
  );
  return positiveVotes[0].total;
};

const checkVote = async (idea_id, comittee_id) => {
  const [hasVote] = await pool.query(
    "SELECT * FROM comittee_votes WHERE idea_id = ? AND user_id = ?",
    [idea_id, comittee_id]
  );
  return hasVote[0];
};

const addMissingVote = async (user_id) => {
  await pool.query(
    "UPDATE users SET noVotes = noVotes + 1 WHERE id = ?",
    user_id
  );
};

exports.checkForInactiveComitteeMembers = async (
  comitteeMembers,
  idea_id,
  idea_user_id
) => {
  for (let i = 0; i < comitteeMembers.length; i++) {
    if (idea_user_id != comitteeMembers[i].id) {
      const hasVote = await checkVote(idea_id, comitteeMembers[i].id);
      if (!!hasVote) await addMissingVote(comitteeMembers[i].id);
    }
  }
};
