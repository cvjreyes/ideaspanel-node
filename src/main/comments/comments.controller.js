const { send } = require("../../helpers/send");
const {
  getCommentsFromIdeaService,
  addCommentService,
} = require("./comments.service");

exports.getCommentsFromIdea = async (req, res) => {
    const { idea_id } = req.params;
    try {
      const comments = await getCommentsFromIdeaService(idea_id);
      send(res, true, comments);
    } catch (err) {
      console.error(err);
      send(res, false, err);
    }
};

exports.addComment = async (req, res) => {
  const { idea_id, user_id, comment } = req.body;
  try {
    const ok = await addCommentService(idea_id, user_id, comment);
    if (ok) return send(res, true, "Comment successfully added");
    return send(res, false, "Stop inventing");
  } catch (err) {
    console.error(err);
    send(res, false, err);
  }
};
