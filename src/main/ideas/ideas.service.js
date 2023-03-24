const fs = require("fs");
require("dotenv").config();
const pool = require("../../../config/db");

exports.getPagePublishedService = async (page) => {
  const [results] = await pool.query(
    "SELECT COUNT(*) as pages FROM ideas WHERE published = 1"
  );
  return (results[0].pages/4).toFixed();
};

exports.getSomeIdeasService = async (page) => {
  const [results] = await pool.query(
    "SELECT ideas.*, users.name, users.profile_pic FROM ideas JOIN users ON ideas.user_id = users.id AND published = 1 LIMIT 4 OFFSET ?",
    page * 4
  );
  return results;
};

exports.getOldestIdeaToApproveService = async (user_id) => {
  const [idea] = await pool.query(
    "SELECT i.* FROM ideas as i LEFT JOIN comittee_votes as v ON i.id = v.idea_id WHERE i.sent_to_validate = 1 AND (v.user_id IS NULL OR v.user_id = ?) AND (v.user_id IS NULL OR v.user_id != ?) ORDER BY i.sent_to_validate_at LIMIT 1",
    [user_id, user_id]
  );
  return idea;
};

exports.getDraftsService = async (user_id) => {
  const [drafts] = await pool.query(
    "SELECT * FROM ideas WHERE draft = 1 AND user_id = ?",
    user_id
  );
  return drafts;
};

exports.getDeniedService = async (user_id) => {
  const [denied] = await pool.query(
    "SELECT * FROM ideas WHERE draft = 0 AND sent_to_validate = 0 AND published = 0 AND user_id = ?",
    user_id
  );
  return denied;
};

exports.getPublishedService = async (user_id) => {
  const [denied] = await pool.query(
    "SELECT * FROM ideas WHERE published = 1 AND user_id = ?",
    user_id
  );
  return denied;
};

exports.getValidatingService = async (user_id) => {
  const [denied] = await pool.query(
    "SELECT * FROM ideas WHERE sent_to_validate = 1 AND user_id = ?",
    user_id
  );
  return denied;
};

exports.getIdeaService = async (idea_id) => {
  const [idea] = await pool.query("SELECT * FROM ideas WHERE id = ?", idea_id);
  return idea[0];
};

exports.getIdeaAndVoteService = async (idea_id, user_id) => {
  const [idea] = await pool.query(
    "SELECT i.*, cv.user_id as voter_id, cv.approved FROM ideas AS i LEFT JOIN comittee_votes AS cv ON i.id = cv.idea_id WHERE i.id = ? AND (cv.user_id = ? or cv.user_id IS NULL)",
    [idea_id, user_id]
  );
  return idea[0];
};

exports.getAllValidatingService = async (user_id) => {
  const [ideas] = await pool.query(
    "SELECT i.*, cv.user_id as voter_id, cv.approved FROM ideas AS i LEFT JOIN comittee_votes AS cv ON i.id = cv.idea_id WHERE sent_to_validate = 1 AND (cv.user_id = ? or cv.user_id IS NULL) ORDER BY sent_to_validate_at",
    [user_id]
  );
  return ideas;
};

exports.insertIdeaService = async (user_id, form) => {
  const [idea] = await pool.query(
    "INSERT INTO ideas (user_id, title, description, anonymous) VALUES (?, ?, ?, ?)",
    [user_id, form.title, form.description, form.anonymous]
  );
  return idea.insertId;
};

exports.addImageService = async (id, image) => {
  await pool.query("UPDATE ideas SET image = ? WHERE id = ?", [image, id]);
};

exports.updateIdeaService = async (idea, publish) => {
  await pool.query(
    "UPDATE ideas SET title = ?, description = ?, sent_to_validate = ?, draft = ?, sent_to_validate_at = CURRENT_TIMESTAMP WHERE id = ?",
    [idea.title, idea.description, publish, !publish, idea.id]
  );
};

exports.deleteIdeaImgService = async (idea_id) => {
  const idea = await this.getIdeaService(idea_id);
  const path =
    "." + idea[0].image.substring(process.env.NODE_SERVER_URL.length);
  fs.unlink(path, function (err) {
    if (err) console.error(err);
    else console.info("Image deleted successfully");
  });
  await pool.query("UPDATE ideas SET image = null WHERE id = ?", idea_id);
};

exports.getSentToValidate = async () => {
  const [sentToValidate] = await pool.query(
    "SELECT * FROM ideas WHERE sent_to_validate = 1"
  );
  return sentToValidate;
};

exports.declineIdea = async (idea_id) => {
  await pool.query(
    "UPDATE ideas SET sent_to_validate = 0, draft = 0, published = 0 WHERE id = ?",
    idea_id
  );
};

exports.publishIdea = async (idea_id) => {
  await pool.query(
    "UPDATE ideas SET sent_to_validate = 0, published = 1, published_at = CURRENT_TIMESTAMP WHERE id = ?",
    idea_id
  );
};
