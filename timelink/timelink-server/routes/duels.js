const express = require('express');
const router = express.Router();

const duels = {}; // Ex: { '1-2': { shooter: {id, choice}, keeper: {id, choice} } }

function getDuelKey(id1, id2) {
  return [id1, id2].sort((a, b) => a - b).join('-');
}

// Commencer un duel
router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;
  const key = getDuelKey(player1_id, player2_id);
  duels[key] = { shooter: {}, keeper: {} };
  res.send({ message: 'Duel créé' });
});

// Envoyer un choix
router.post('/choose', (req, res) => {
  const { userId, friendId, choice } = req.body;

  const key = getDuelKey(userId, friendId);
  if (!duels[key]) {
    return res.status(404).send({ message: 'Duel non trouvé' });
  }

  const duel = duels[key];

  // Définir qui est tireur / gardien
  if (!duel.shooter.id && !duel.keeper.id) {
    // Premier à choisir = tireur
    duel.shooter = { id: userId, choice };
  } else if (duel.shooter.id === userId) {
    duel.shooter.choice = choice;
  } else if (!duel.keeper.id || duel.keeper.id === userId) {
    duel.keeper = { id: userId, choice };
  } else {
    return res.status(400).send({ message: 'Erreur assignation joueur' });
  }

  // Vérifier si les deux ont choisi
  if (duel.shooter.choice && duel.keeper.choice) {
    let winnerId;
    if (duel.shooter.choice === duel.keeper.choice) {
      winnerId = duel.keeper.id; // gardien gagne
    } else {
      winnerId = duel.shooter.id; // tireur gagne
    }

    delete duels[key];

    return res.send({ finished: true, winnerId });
  }

  // Sinon, on attend l'autre
  res.send({ finished: false });
});

module.exports = router;
