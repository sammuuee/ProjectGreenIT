<template>
    <div class="penalty-container">
      <h1>Penalty Game ⚽</h1>
      <p v-if="!result">Choisis un côté :</p>
  
      <div v-if="!hasChosen">
        <button @click="makeChoice('left')">Gauche</button>
        <button @click="makeChoice('center')">Centre</button>
        <button @click="makeChoice('right')">Droite</button>
      </div>
  
      <p v-if="hasChosen && !result">En attente de l'autre joueur...</p>
  
      <div v-if="result">
        <h2>{{ result }}</h2>
        <button @click="$emit('back')">Retour au Chat</button>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  
  export default {
    props: ['user', 'friendId', 'serverUrl'],
    data() {
      return {
        hasChosen: false,
        result: null,
        polling: null
      };
    },
    methods: {
      async makeChoice(direction) {
        try {
          // Déterminer le rôle au hasard
          const role = Math.random() > 0.5 ? 'tireur' : 'gardien';
  
          await axios.post(`${this.serverUrl}/api/penalty/choose`, {
            userId: this.user.id,
            role,
            choice: direction
          });
  
          this.hasChosen = true;
          this.pollForResult();
        } catch (err) {
          console.error('Erreur en envoyant le choix', err);
        }
      },
      pollForResult() {
        this.polling = setInterval(async () => {
          try {
            const res = await axios.post(`${this.serverUrl}/api/penalty/choose`, {
              userId: this.user.id,
              role: 'check',
              choice: 'none'
            });
  
            if (res.data.result) {
              this.result = res.data.result;
              clearInterval(this.polling);
            }
          } catch (err) {
            console.error('Erreur en polling du resultat', err);
          }
        }, 2000);
      }
    },
    beforeUnmount() {
      clearInterval(this.polling);
    }
  };
</script>
  
<style>
  .penalty-container {
    text-align: center;
    margin-top: 50px;
    color: white;
  }
  button {
    background-color: #0078ff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
  }
  button:hover {
    background-color: #005bb5;
  }
</style>
  