const fs = require("fs");
require("dotenv").config();
const pool = require("../../../config/db");

exports.getSomeIdeasService = async (page) => {
  const [results] = await pool.query(
    "SELECT ideas.*, users.name, users.profile_pic FROM ideas JOIN users ON ideas.user_id = users.id AND published = 1 LIMIT 20 OFFSET ?",
    page * 20
  );
  return results;
};

exports.getOldestIdeaToApproveService = async (user_id) => {
  const [idea] = await pool.query(
    "SELECT i.* FROM ideas as i LEFT JOIN votes as v ON i.id = v.idea_id WHERE i.sent_to_validate = 1 AND i.user_id != ? AND (v.user_id IS NULL OR v.user_id != ?) ORDER BY i.sent_to_validate_at LIMIT 1",
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
    "UPDATE ideas SET title = ?, description = ?, sent_to_validate = ?, draft = ?, sent_to_validate_at = CURRENT_TIMESTAMP WHERE id = ?",
    [idea.title, idea.description, publish, !publish, idea.id]
  );
};

exports.deleteIdeaImgService = async (idea_id) => {
  const idea = await this.getIdeaService(idea_id);
  const path =
    "." + idea[0].image.substring(process.env.NODE_SERVER_URL.length);
  console.log("path: ", path);
  fs.unlink(path, function (err) {
    if (err) console.error(err);
    else console.log("success");
  });
  await pool.query("UPDATE ideas SET image = null WHERE id = ?", idea_id);
};
