// === backend/penalty.js ===

const express = require('express');
const router = express.Router();

let duelData = {
  tireur: null, // { userId, choice }
  gardien: null // { userId, choice }
};

router.post('/choose', (req, res) => {
  const { userId, role, choice } = req.body;

  if (role === 'tireur') {
    duelData.tireur = { userId, choice };
  } else if (role === 'gardien') {
    duelData.gardien = { userId, choice };
  }

  // Vérifier si les deux ont joué
  if (duelData.tireur && duelData.gardien) {
    let result;
    if (duelData.tireur.choice === duelData.gardien.choice) {
      result = '🧤 Arrêt du gardien !';
    } else {
      result = '🎯 But marqué !';
    }

    // Sauvegarde du résultat pour envoyer à tout le monde
    const fullResult = {
      result,
      tireur: duelData.tireur,
      gardien: duelData.gardien
    };

    // Reset pour un nouveau duel
    duelData = { tireur: null, gardien: null };

    return res.json(fullResult);
  }

  res.json({ message: "En attente de l'autre joueur..." });
});

module.exports = router;
