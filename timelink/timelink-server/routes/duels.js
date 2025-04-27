const express = require('express');
const router = express.Router();

// Stockage en mémoire des duels
const duels = {}; // { "1-2": { choices: { user1Id: "left", user2Id: "right" } } }

function getDuelKey(player1, player2) {
  return [player1, player2].sort((a, b) => a - b).join('-');
}

router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;
  const key = getDuelKey(player1_id, player2_id);
  duels[key] = { choices: {} };
  res.send({ message: "Duel démarré !" });
});

router.post('/choose', (req, res) => {
  const { userId, friendId, choice } = req.body;
  const key = getDuelKey(userId, friendId);

  if (!duels[key]) {
    duels[key] = { choices: {} };
  }

  duels[key].choices[userId] = choice;

  const players = Object.keys(duels[key].choices);

  if (players.length === 2) {
    const [id1, id2] = players;
    const choice1 = duels[key].choices[id1];
    const choice2 = duels[key].choices[id2];

    // Compare les choix
    let winner;
    if (choice1 !== choice2) {
      winner = id1; // Le tireur a marqué
    } else {
      winner = id2; // Le gardien a arrêté
    }

    // Supprimer après résultat
    delete duels[key];

    return res.send({
      finished: true,
      winnerId: winner
    });
  } else {
    return res.send({ finished: false });
  }
});

module.exports = router;