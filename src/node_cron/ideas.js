const pool = require("../../config/db");
const { getAllIdeasService } = require("../main/ideas/ideas.service");

exports.checkDateFromIdeasValidate = async () => {
  try {
    const [results] = await pool.query("SELECT * FROM ideas")
    const actualDate = new Date();
    for (let i = 0; i < results.length; i++) {
      const createdDate = new Date(results[i].sent_to_validate_at);
      const daysPassed = (
        (actualDate - createdDate) /
        1000 /
        60 /
        60 /
        24
      ).toFixed();
      if (daysPassed > 4) {
        await pool.query(
          "UPDATE ideas SET sent_to_validate = 0, draft = 1, sent_to_validate_at = NULL WHERE id = ?",
          results[i].id
        );
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
