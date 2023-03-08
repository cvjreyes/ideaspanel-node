const pool = require("../../config/db");

exports.checkDateFromIdeasValidate = async () => {
  try {
    const [ideas] = await pool.query("SELECT * FROM ideas");
    const actualDate = new Date();
    for (let i = 0; i < ideas.length; i++) {
      const createdDate = new Date(ideas[i].sent_to_validate_at);
      const daysPassed = (
        (actualDate - createdDate) /
        1000 /
        60 /
        60 /
        24
      ).toFixed();
      if (daysPassed > 14) {
        await pool.query(
          "UPDATE ideas SET sent_to_validate = 0, draft = 0 WHERE id = ?",
          ideas[i].id
        );
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.ideasPublished = async () => {
  try {
    // Suma de los usuarios que son comittee
    const [comitteeUsers] = await pool.query(
      "SELECT COUNT(*) as 'ComiteeUsers' FROM users WHERE isComitee = 1"
    );
    // Recogemos todas las ideas y las recorremos
    const [ideas] = await pool.query("SELECT * FROM ideas");
    for (let i = 0; i < ideas.length; i++) {
      // Contamos la cantidad de votos positivos de cada idea
      const [positiveVotes] = await pool.query(
        "SELECT COUNT(*) as 'PositiveVotes' FROM votes WHERE approved = 1 AND idea_id = ? ",
        ideas[i].id
      );
      // Si esa idea tiene mas votos positivos que la mitad de la suma de todos los usuarios que son comittee
      if (
        positiveVotes[0].PositiveVotes >
        (comitteeUsers[0].ComiteeUsers / 2).toFixed()
      ) {
        // Se publica y si se le asigna la fecha correspondiente actual.
        console.log("entra");
        await pool.query(
          "UPDATE ideas SET sent_to_validate = 0, published = 1, published_at = CURRENT_TIMESTAMP WHERE id = ?",
          ideas[i].id
        );
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
