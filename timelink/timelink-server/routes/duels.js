const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Ton fichier connexion MySQL

// Créer un duel ou retrouver
router.post('/start', (req, res) => {
  const { player1_id, player2_id } = req.body;

  db.query(
    'INSERT INTO penalty_duels (player1_id, player2_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP',
    [player1_id, player2_id],
    (err, result) => {
      if (err) return res.status(500).send({ message: 'Erreur création duel' });
      res.send({ message: 'Duel prêt' });
    }
  );
});

// Envoyer choix / Vérifier résultat
router.post('/choose', (req, res) => {
  const { userId, friendId, choice } = req.body;

  const [p1, p2] = userId < friendId ? [userId, friendId] : [friendId, userId];

  db.query(
    'SELECT * FROM penalty_duels WHERE player1_id = ? AND player2_id = ?',
    [p1, p2],
    (err, results) => {
      if (err) return res.status(500).send({ message: 'Erreur serveur' });
      if (results.length === 0) return res.status(404).send({ message: 'Duel introuvable' });

      const duel = results[0];

      // Sauvegarder le choix
      const isPlayer1 = userId === p1;
      const column = isPlayer1 ? 'player1_choice' : 'player2_choice';

      if (choice) {
        db.query(
          `UPDATE penalty_duels SET ${column} = ? WHERE id = ?`,
          [choice, duel.id],
          (err2) => {
            if (err2) return res.status(500).send({ message: 'Erreur maj choix' });
            res.send({ finished: false });
          }
        );
      } else {
        // Si on veut juste vérifier sans choix
        if (duel.player1_choice && duel.player2_choice) {
          let winnerId;
          if (duel.player1_choice === duel.player2_choice) {
            winnerId = p2; // Gardien gagne
          } else {
            winnerId = p1; // Tireur gagne
          }

          // Duel terminé : supprimer pour pas polluer
          db.query('DELETE FROM penalty_duels WHERE id = ?', [duel.id], () => {});

          return res.send({ finished: true, winnerId });
        } else {
          return res.send({ finished: false });
        }
      }
    }
  );
});

module.exports = router;