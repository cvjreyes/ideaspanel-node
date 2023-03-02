const pool = require("../../../config/db");

exports.getSomeIdeasService = async (page) => {
  const [results] = await pool.query(
    "SELECT ideas.*, users.name, users.profile_pic FROM ideas JOIN users ON ideas.user_id = users.id LIMIT 20 OFFSET ?",
    page * 20
  );
  return results;
};

exports.getOldestIdeaToApproveService = async (user_id) => {
  const [idea] = await pool.query(
    "SELECT * FROM ideas WHERE sent_to_validate = 1 AND user_id != ? ORDER BY sent_to_validate_at LIMIT 1",
    user_id
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

exports.getIdeaService = async (idea_id) => {
  const [idea] = await pool.query("SELECT * FROM ideas WHERE id = ?", idea_id);
  return idea;
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
    "UPDATE ideas SET title = ?, description = ?, published = ?, draft = ? WHERE id = ?",
    [idea.title, idea.description, publish, !publish, idea.id]
  );
};
