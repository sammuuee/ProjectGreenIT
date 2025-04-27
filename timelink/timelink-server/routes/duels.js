const express = require('express');
const router = express.Router();

const duels = {}; // { key: { tireurChoice, gardienChoice, result, views } }

function getDuelKey(id1, id2) {
  return [id1, id2].sort((a, b) => a - b).join('-');
}

// Commencer un duel
router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;
  const key = getDuelKey(player1_id, player2_id);
  duels[key] = { tireurChoice: null, gardienChoice: null, result: null, views: new Set() };
  res.send({ message: 'Duel commencé !' });
});

// Envoyer un choix ou checker le résultat
router.post('/choose', (req, res) => {
  const { userId, friendId, choice } = req.body;
  if (!userId || !friendId) {
    return res.status(400).send({ error: "Missing userId or friendId" });
  }

  const duelKey = getDuelKey(userId, friendId);
  if (!duels[duelKey]) {
    duels[duelKey] = { [userId]: null, [friendId]: null };
  }

  if (choice !== null) {
    duels[duelKey][userId] = choice;
  }

  const user1Choice = duels[duelKey][userId];
  const user2Choice = duels[duelKey][friendId];

  if (user1Choice !== null && user2Choice !== null) {
    // Duel terminé
    let winnerId;

    if (user1Choice === user2Choice) {
      winnerId = friendId; // le gardien arrête
    } else {
      winnerId = userId; // le tireur marque
    }

    delete duels[duelKey];

    return res.send({ finished: true, winnerId });
  }

  res.send({ finished: false });
});

module.exports = router;