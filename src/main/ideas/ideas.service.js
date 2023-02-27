const pool = require("../../../config/db");

exports.getSomeIdeasService = async (page) => {
  const [results] = await pool.query(
    "SELECT * FROM ideas LIMIT 20 OFFSET ?",
    page * 20
  );
  return results;
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
