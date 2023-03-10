const pool = require("../../config/db");
const { getComitteeUsersService } = require("../main/users/users.service");

exports.checkForExpiredIdeas = async () => {
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

exports.checkForIdeasToPublish = async () => {
  try {
    // Suma de los usuarios que son comittee
    const [comitteeUsers] = await pool.query(
      "SELECT COUNT(*) as 'comiteeUsers' FROM users WHERE isComittee = 1"
    );
    // Recogemos todas las ideas y las recorremos
    const [ideas] = await pool.query("SELECT * FROM ideas WHERE published = 0");
    for (let i = 0; i < ideas.length; i++) {
      // Contamos la cantidad de votos positivos de cada idea
      const [positiveVotes] = await pool.query(
        "SELECT COUNT(*) as 'positiveVotes' FROM comittee_votes WHERE approved = 1 AND idea_id = ? ",
        ideas[i].id
      );
      // Si esa idea tiene mas votos positivos que la mitad de la suma de todos los usuarios que son comittee
      if (
        positiveVotes[0].positiveVotes >=
        (comitteeUsers[0].comiteeUsers / 2).toFixed()
      ) {
        // Se publica y si se le asigna la fecha correspondiente actual.
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

// Este aun no se ha probado
exports.checkForInactiveComiteeMembers = async () => {
  try {
    // Get all users that are comittee
    const users = await getComitteeUsersService();
    // Recorremos todos los usuarios que son comitte
    for (let y = 0; y < users.length; y++) {
      // Si esta query sale con 1 quiere decir que este usuario a votado esta idea
      const [userVotedIdea] = pool.query(
        "SELECT COUNT(*) FROM comittee_votes WHERE idea_id = ? AND user_id = ?",
        ideas[i].id,
        users[y].id
      );
      // Si su resultado es 0 entra en estas dos condiciones
      if (!userVotedIdea) {
        if (users[y].noVotes < 5) {
          // Si lleva menos de 5 votos consecutivos sin votar se le suma 1 al contador de ese usuario
          await pool.query(
            "UPDATE users SET noVotes = noVotes + 1 WHERE id = ?",
            users[y].id
          );
        }
      } else {
        // Si ha votado esta idea y no ha llegado a los 5 no votos consecutivos se le reinicia el contador
        await pool.query(
          "UPDATE users SET noVotes = 0 WHERE id = ?",
          users[y].id
        );
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
