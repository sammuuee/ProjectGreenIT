<template>
    <div class="penalty-container">
      <h1>Penalty Game ⚽</h1>
  
      <div v-if="!choiceMade">
        <p>Choisis un côté :</p>
        <button @click="sendChoice('gauche')">Gauche</button>
        <button @click="sendChoice('centre')">Centre</button>
        <button @click="sendChoice('droite')">Droite</button>
      </div>
  
      <div v-else-if="!result">
        <p>En attente de l'autre joueur...</p>
      </div>
  
      <div v-else>
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
        choiceMade: false,
        result: null,
        polling: null,
      };
    },
    methods: {
      async sendChoice(choice) {
        this.choiceMade = true;
  
        await axios.post(`${this.serverUrl}/api/duels/choose`, {
          userId: this.user.id,
          friendId: this.friendId,
          choice: choice
        });
  
        this.startPolling();
      },
      startPolling() {
        this.polling = setInterval(async () => {
          const res = await axios.post(`${this.serverUrl}/api/duels/choose`, {
            userId: this.user.id,
            friendId: this.friendId,
            choice: null
          });
  
          if (res.data.finished) {
            if (res.data.winnerId === this.user.id) {
              this.result = "🎯 Tu as gagné le duel !";
            } else {
              this.result = "🧤 Tu as perdu le duel !";
            }
            clearInterval(this.polling);
          }
        }, 1000);
      }
    },
    beforeUnmount() {
      if (this.polling) clearInterval(this.polling);
    }
  };
</script>
  
<style scoped>
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