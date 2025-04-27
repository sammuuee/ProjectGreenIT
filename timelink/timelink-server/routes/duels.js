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

// Envoyer un choix
router.post('/choose', (req, res) => {
  const { userId, role, choice } = req.body;

  const duelKey = Object.keys(duels).find(key => key.includes(userId.toString()));
  if (!duelKey) return res.status(400).send({ message: "Duel non trouvé." });

  const duel = duels[duelKey];

  if (role === 'tireur') {
    duel.tireurChoice = choice;
  } else if (role === 'gardien') {
    duel.gardienChoice = choice;
  }

  res.send({ message: 'Choix enregistré.' });
});

// Vérifier si les deux joueurs ont choisi
router.post('/check', (req, res) => {
  const { userId } = req.body;

  const duelKey = Object.keys(duels).find(key => key.includes(userId.toString()));
  if (!duelKey) return res.status(400).send({ message: "Duel non trouvé." });

  const duel = duels[duelKey];

  if (duel.tireurChoice && duel.gardienChoice) {
    const success = duel.tireurChoice !== duel.gardienChoice;
    const message = success ? "BUT ! 🎯" : "ARRÊTÉ ! 🧤";

    // Nettoyer le duel pour éviter les fuites mémoire
    delete duels[duelKey];

    return res.send({ result: message });
  } else {
    return res.send({ waiting: true });
  }
});

module.exports = router;
