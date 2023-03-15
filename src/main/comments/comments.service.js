const pool = require("../../../config/db");

exports.getCommentsFromIdeaService = async (idea_id) => {
  const [comments] = await pool.query(
    "SELECT comments.*, users.name, users.profile_pic FROM comments JOIN users ON comments.user_id = users.id WHERE comments.idea_id = ?",
    idea_id
  );
  return comments;
};

exports.addCommentService = async (idea_id, user_id, comment) => {
  const [addComment] = await pool.query(
    "INSERT INTO comments (idea_id, user_id, comment) VALUES (?, ?, ?)",
    [idea_id, user_id, comment]
  );

  return addComment;
};

exports.deleteCommentService = async (comment_id) => {
  const [deleteComment] = await pool.query(
    "DELETE FROM comments WHERE id = ?",
    [comment_id]
  );

  return deleteComment;
};
