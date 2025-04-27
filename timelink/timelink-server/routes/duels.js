const express = require('express');
const router = express.Router();

// Stockage temporaire des duels
const duels = {}; // clé = duelKey (ex: 1-2), valeur = { tireurChoice, gardienChoice }

function getDuelKey(id1, id2) {
  return [id1, id2].sort((a, b) => a - b).join('-');
}

// Commencer un duel
router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;
  const key = getDuelKey(player1_id, player2_id);
  duels[key] = { tireurChoice: null, gardienChoice: null };
  res.send({ message: 'Duel commencé !' });
});

// Envoyer un choix ou checker le résultat
router.post('/choose', (req, res) => {
  const { userId, role, choice } = req.body;

  const duelKey = Object.keys(duels).find(key => key.includes(userId.toString()));
  if (!duelKey) return res.status(400).send({ message: "Duel non trouvé." });

  const duel = duels[duelKey];

  if (role === 'tireur') {
    if (choice) duel.tireurChoice = choice;
  } else if (role === 'gardien') {
    if (choice) duel.gardienChoice = choice;
  }

  if (duel.tireurChoice && duel.gardienChoice) {
    const success = duel.tireurChoice !== duel.gardienChoice;
    const message = success ? "BUT ! 🎯" : "ARRÊTÉ ! 🧤";

    // Réinitialiser ce duel pour éviter des bugs
    delete duels[duelKey];

    return res.send({ result: message });
  } else {
    return res.send({ waiting: true });
  }
});

module.exports = router;
