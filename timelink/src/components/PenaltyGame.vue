<template>
    <div class="penalty-container">
      <h1>Penalty Game ⚽</h1>
      <div v-if="!choiceMade">
        <p>Choisis un côté :</p>
        <button @click="makeChoice('gauche')">Gauche</button>
        <button @click="makeChoice('centre')">Centre</button>
        <button @click="makeChoice('droite')">Droite</button>
      </div>
  
      <div v-else-if="!result">
        <p>En attente de l'autre joueur...</p>
      </div>
  
      <div v-else>
        <h2>{{ result.result }}</h2>
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
        role: '',
        choiceMade: false,
        result: null,
        polling: null,
      };
    },
    mounted() {
      this.role = Math.random() > 0.5 ? 'tireur' : 'gardien'; // tireur ou gardien aléatoirement
    },
    methods: {
      async makeChoice(side) {
        this.choiceMade = true;
  
        await axios.post(`${this.serverUrl}/api/duels/choose`, {
          userId: this.user.id,
          role: this.role,
          choice: side
        });
  
        this.startPollingResult();
      },
      startPollingResult() {
        this.polling = setInterval(async () => {
          const res = await axios.post(`${this.serverUrl}/api/duels/choose`, {
            userId: this.user.id,
            role: 'check'
          });
  
          if (res.data.result) {
            this.result = res.data;
            clearInterval(this.polling);
          }
        }, 1000); // Toutes les secondes
      }
    },
    beforeUnmount() {
      if (this.polling) {
        clearInterval(this.polling);
      }
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
  