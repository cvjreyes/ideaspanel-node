const pool = require("../../../config/db");

exports.getSomeIdeasService = async (page) => {
  const [results] = await pool.query(
    "SELECT * FROM ideas LIMIT 20 OFFSET ?",
    page * 20
  );
  return results;
};

exports.getOldestIdeaToApproveService = async () => {
  const [idea] = await pool.query(
    "SELECT * FROM ideas WHERE sent_to_validate = 1 ORDER BY sent_to_validate_at LIMIT 1  "
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
