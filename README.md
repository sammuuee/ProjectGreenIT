# ProjectGreenIT
Lien pour le drive avec l'idée:
https://docs.google.com/document/d/10Ch5UJA1F-GDrM1zZy02BQgR8GxilTaZ0I6OckdYbPE/edit?usp=sharing

Project Green IT - Timelink

Bienvenue sur le projet Timelink !
Ce projet est un mini réseau social simplifié, permettant d'échanger des messages, d'ajouter des amis et de faire des duels sous forme de mini-jeu (Penalty Game).

---

Contenu du projet :

Frontend : Vite + Vue.js (/src)

Backend : Node.js + Express.js (/timelink-server)

Base de données : MySQL (hébergée sur Railway)

Déploiement :
Frontend sur Vercel
Backend sur Render

---

Fonctionnalités principales :
Inscription / Connexion
Ajout et gestion d'amis
Système de messagerie entre amis
Duel Penalty Game (un mini-jeu entre amis)
Suppression automatique des anciens messages (après 24h sans activité)

---

Cloner et démarrer le projet

Cloner le dépôt

git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo


Configurer les variables d'environnement

Dans /src, créer un fichier .env :
VITE_API_URL=https://votre-backend-render.com/


Installer les dépendances

Pour le frontend :
cd src
npm install

Pour le backend :
cd ../timelink-server
npm install


Démarrer localement

Frontend :
npm run dev

Backend :
node index.js


---

Base de données

Le script de création de la base est disponible dans timelink-server/database/init.sql.

Pour initialiser manuellement :

source chemin/vers/init.sql

Important : MySQL doit être démarré et accessible !

---

Conventions de contribution

Commits :
Style : [Type] - Description

Exemples :
feat: ajout de la messagerie

fix: correction bug duel

docs: mise à jour du README


Branches :
Travaillez dans des branches (feature/xxx, bugfix/xxx)
Ouvrez des pull requests pour toute modification

Pull Requests :
Décrire ce qui a été fait
Mentionner les issues associées si applicable

---

Structure du projet

timelink/
├── src/
│   ├── components/
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── timelink-server/
│   ├── database/
│   │   ├── db.js
│   │   └── init.sql
│   ├── routes/
│   │   ├── users.js
│   │   ├── messages.js
│   │   ├── friends.js
│   │   └── duels.js
│   └── index.js
│
├── package.json
└── README.md

---

Historique de développement

Voir l'onglet Pull requests pour retrouver tout l'historique de contributions

Chaque étape de développement est commitée avec soin

Les merges ont été faits proprement sur la branche principale main ou master

---

Merci !

Merci de votre lecture.
N'hésitez pas à cloner et tester le projet !
