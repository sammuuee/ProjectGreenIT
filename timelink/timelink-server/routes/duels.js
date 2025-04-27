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
  const { userId, role, choice } = req.body;

  const duelKey = Object.keys(duels).find(key => key.includes(userId.toString()));
  if (!duelKey) return res.status(400).send({ message: "Duel non trouvé." });

  const duel = duels[duelKey];

  if (role === 'tireur' && choice) {
    duel.tireurChoice = choice;
  } else if (role === 'gardien' && choice) {
    duel.gardienChoice = choice;
  }

  // Si déjà un résultat, juste le renvoyer
  if (duel.result) {
    duel.views.add(userId);
    if (duel.views.size >= 2) {
      delete duels[duelKey]; // Supprimer le duel après que les 2 joueurs ont vu
    }
    return res.send({ result: duel.result });
  }

  if (duel.tireurChoice && duel.gardienChoice) {
    const success = duel.tireurChoice !== duel.gardienChoice;
    duel.result = success ? "🎯 Tu as marqué !" : "🧤 Ton tir a été arrêté !";

    duel.views.add(userId);
    return res.send({ result: duel.result });
  } else {
    return res.send({ waiting: true });
  }
});

module.exports = router;