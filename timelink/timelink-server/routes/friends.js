const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Envoyer une demande d'ami
router.post('/request', (req, res) => {
  const { requester_id, receiver_id } = req.body;
  db.query(
    'INSERT INTO friends (requester_id, receiver_id) VALUES (?, ?)',
    [requester_id, receiver_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Demande envoyée' });
    }
  );
});

// Répondre à une demande d'ami
router.post('/respond', (req, res) => {
  const { requester_id, receiver_id, status } = req.body; // status = 'accepted' ou 'rejected'
  db.query(
    'UPDATE friends SET status = ? WHERE requester_id = ? AND receiver_id = ?',
    [status, requester_id, receiver_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: `Demande ${status}` });
    }
  );
});

// Voir la liste des amis acceptés
router.get('/list/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT * FROM friends 
     WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted'`,
    [userId, userId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

// Voir les demandes en attente reçues
router.get('/pending/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT * FROM friends 
     WHERE receiver_id = ? AND status = 'pending'`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

// Voir si deux utilisateurs sont amis
router.get('/status/:u1/:u2', (req, res) => {
  const { u1, u2 } = req.params;
  db.query(
    `SELECT status FROM friends WHERE 
     (requester_id = ? AND receiver_id = ?) OR 
     (requester_id = ? AND receiver_id = ?)`,
    [u1, u2, u2, u1],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.send({ status: 'none' });
      res.send({ status: results[0].status });
    }
  );
});

module.exports = router;