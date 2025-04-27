<template>
    <div class="penalty-container">
      <h1>⚽ Duel Penalty ⚽</h1>
      <p v-if="role === 'tireur'">Tu es le <strong>Tireur</strong> 🎯 : choisis où tirer !</p>
      <p v-else-if="role === 'gardien'">Tu es le <strong>Gardien</strong> 🧤 : choisis où plonger !</p>
  
      <div class="choices">
        <button @click="choose('left')">⬅️ Gauche</button>
        <button @click="choose('center')">⬆️ Centre</button>
        <button @click="choose('right')">➡️ Droite</button>
      </div>
  
      <div v-if="result" class="result">
        <p><strong>Résultat :</strong> {{ result }}</p>
        <button class="back" @click="$emit('back')">Retour au Chat</button>
      </div>
    </div>
</template>
  
<script>
  export default {
    props: ['user', 'friendId', 'serverUrl'],
    data() {
      return {
        role: '', // 'tireur' ou 'gardien'
        playerChoice: '',
        opponentChoice: '',
        result: '',
      };
    },
    created() {
      // Attribuer le rôle au hasard pour l'instant
      this.role = Math.random() < 0.5 ? 'tireur' : 'gardien';
    },
    methods: {
      async choose(direction) {
        this.playerChoice = direction;
  
        // Simulation : pour le test, l'adversaire choisit au hasard
        this.opponentChoice = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
  
        this.computeResult();
      },
      computeResult() {
        if (this.role === 'tireur') {
          if (this.playerChoice !== this.opponentChoice) {
            this.result = '🎯 BUT !';
          } else {
            this.result = '🧤 Arrêt du gardien !';
          }
        } else if (this.role === 'gardien') {
          if (this.playerChoice === this.opponentChoice) {
            this.result = '🧤 Tu as arrêté le tir !';
          } else {
            this.result = '🎯 Tu as encaissé un but...';
          }
        }
      }
    }
  };
</script>
  
<style scoped>
  .penalty-container {
    text-align: center;
    margin-top: 50px;
    color: white;
  }
  
  .choices {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
  }
  
  button {
    background-color: #0078ff;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #005bb5;
  }
  
  .result {
    margin-top: 30px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .back {
    margin-top: 40px;
    background-color: #ff5c5c;
  }
  
  .back:hover {
    background-color: #cc4444;
  }
</style>