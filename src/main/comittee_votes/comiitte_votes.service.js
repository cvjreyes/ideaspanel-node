const pool = require("../../../config/db");
const { getComitteeUsersService } = require("../users/users.service");
const { publishIdea } = require("../ideas/ideas.service");

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

exports.updateVoteService = async (idea_id, vote) => {
  await pool.query("UPDATE comittee_votes SET approved = ? WHERE idea_id = ?", [
    vote,
    idea_id,
  ]);
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

const getTimesWithoutVoting = async (user_id) => {
  const [noVotes] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    user_id
  );
  return noVotes[0].noVotes;
};

const removeComittee = async (user_id) => {
  await pool.query("UPDATE users SET isComittee = 0 WHERE id = ?", user_id);
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
      const numOfTimesWithoutVoting = await getTimesWithoutVoting(
        comitteeMembers[i].id
      );
      if (numOfTimesWithoutVoting >= 5) {
        removeComittee(comitteeMembers[i].id);
      }
    }
  }
};

const countTotalIdeaVotes = async (idea_id) => {
  const [votes] = await pool.query(
    "SELECT * FROM comittee_votes WHERE idea_id = ?",
    idea_id
  );
  return votes.length;
};

exports.checkIfAllVotesEmitted = async (idea_id) => {
  const comitteeMembers = await getComitteeUsersService();
  const totalComitteeMembers = comitteeMembers.length;
  const ideaVotes = await countTotalIdeaVotes(idea_id);
  if (totalComitteeMembers === ideaVotes) {
    publishIdea(idea_id);
  }
};
