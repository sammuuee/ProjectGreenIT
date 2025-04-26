require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1); // Arrête l'app si erreur
  }
  console.log('Connecté à MySQL avec Railway ✅');
});

module.exports = db;
