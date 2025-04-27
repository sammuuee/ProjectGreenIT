const express = require('express');
const router = express.Router();

const duels = {}; // { "1-2": { tireurChoice: null, gardienChoice: null } }

function getDuelKey(id1, id2) {
  return [id1, id2].sort((a, b) => a - b).join('-');
}

router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;
  const key = getDuelKey(player1_id, player2_id);
  duels[key] = { tireurChoice: null, gardienChoice: null };
  res.send({ message: 'Duel commencé !' });
});

router.post('/choose', (req, res) => {
  const { userId, role, choice } = req.body;

  const duelKey = Object.keys(duels).find(key => key.includes(userId.toString()));
  if (!duelKey) return res.status(400).send({ message: "Duel non trouvé." });

  const duel = duels[duelKey];

  if (role === 'tireur' && choice) duel.tireurChoice = choice;
  if (role === 'gardien' && choice) duel.gardienChoice = choice;

  if (duel.tireurChoice && duel.gardienChoice) {
    const success = duel.tireurChoice !== duel.gardienChoice;
    const message = success ? "BUT ! 🎯" : "ARRETÉ ! 🧜";
    delete duels[duelKey];
    return res.send({ result: message });
  }

  return res.send({ waiting: true });
});

module.exports = router;
