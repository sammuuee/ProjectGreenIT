// server/routes/duels.js
const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Lancer un duel
router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;

  // Choisir un gagnant aléatoire
  const winner_id = Math.random() < 0.5 ? player1_id : player2_id;

  db.query(
    'INSERT INTO duels (player1_id, player2_id, winner_id, played_at) VALUES (?, ?, ?, NOW())',
    [player1_id, player2_id, winner_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Duel joué !', winner_id });
    }
  );
});

// Historique des duels entre deux joueurs
router.get('/history/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;

  db.query(
    `SELECT * FROM duels WHERE 
     (player1_id = ? AND player2_id = ?) 
     OR (player1_id = ? AND player2_id = ?)
     ORDER BY played_at DESC`,
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

// Duel du jour entre deux joueurs ?
router.get('/today/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  db.query(
    `SELECT * FROM duels WHERE 
     ((player1_id = ? AND player2_id = ?) OR (player1_id = ? AND player2_id = ?))
     AND DATE(played_at) = CURDATE()`,
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send({ alreadyPlayed: results.length > 0 });
    }
  );
});

module.exports = router;
