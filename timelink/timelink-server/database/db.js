const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // remplace par ton mot de passe MySQL si besoin
  database: 'timelink'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à MySQL');
});

module.exports = db;
