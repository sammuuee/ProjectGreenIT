const express = require('express');
const router = express.Router();

let duelData = {
  tireur: null,
  gardien: null
};

router.post('/choose', (req, res) => {
  const { userId, role, choice } = req.body;

  // Si un joueur veut juste checker le résultat
  if (role === 'check') {
    if (duelData.tireur && duelData.gardien) {
      let result;
      if (duelData.tireur.choice === duelData.gardien.choice) {
        result = '🧤 Arrêt du gardien !';
      } else {
        result = '🎯 But marqué !';
      }

      const fullResult = {
        result,
        tireur: duelData.tireur,
        gardien: duelData.gardien
      };

      duelData = { tireur: null, gardien: null }; // Reset pour le prochain duel

      return res.json(fullResult);
    } else {
      return res.json({ message: "En attente de l'autre joueur..." });
    }
  }

  // Si le joueur envoie son choix normalement
  if (role === 'tireur') {
    duelData.tireur = { userId, choice };
  } else if (role === 'gardien') {
    duelData.gardien = { userId, choice };
  }

  if (duelData.tireur && duelData.gardien) {
    let result;
    if (duelData.tireur.choice === duelData.gardien.choice) {
      result = '🧤 Arrêt du gardien !';
    } else {
      result = '🎯 But marqué !';
    }

    const fullResult = {
      result,
      tireur: duelData.tireur,
      gardien: duelData.gardien
    };

    duelData = { tireur: null, gardien: null };

    return res.json(fullResult);
  }

  res.json({ message: "En attente de l'autre joueur..." });
});

module.exports = router;

