<template>
    <div class="penalty-container">
      <h2>Mini Tir au but ⚽</h2>
  
      <div v-if="!hasShot">
        <h3>Choisis où tirer :</h3>
        <button @click="shoot('left')">Gauche</button>
        <button @click="shoot('center')">Milieu</button>
        <button @click="shoot('right')">Droite</button>
      </div>
  
      <div v-else-if="!hasSaved">
        <h3>Ton adversaire plonge... Attends</h3>
      </div>
  
      <div v-else>
        <h3>{{ resultMessage }}</h3>
        <button @click="$emit('back')">Retour au chat</button>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  
  export default {
    props: ['user', 'friendId', 'serverUrl'],
    data() {
      return {
        hasShot: false,
        hasSaved: false,
        resultMessage: ''
      };
    },
    methods: {
      async shoot(direction) {
        try {
          // Ici tu simules simplement le duel pour ce mini jeu
          const response = await axios.post(`${this.serverUrl}/api/duels/penalty`, {
            shooter_id: this.user.id,
            goalie_id: this.friendId,
            shot_direction: direction
          });
  
          const result = response.data.result;
          this.resultMessage = result === 'goal' ? 'BUTTTT 🎉' : 'Arrêté 😢';
          this.hasShot = true;
          this.hasSaved = true;
        } catch (error) {
          console.error('Erreur penalty:', error);
          alert('Erreur lors du tir');
        }
      }
    }
  };
</script>
  
<style>
  .penalty-container {
    text-align: center;
    padding: 20px;
  }
  button {
    background-color: #0078ff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    font-size: 18px;
    border-radius: 8px;
    cursor: pointer;
  }
  button:hover {
    background-color: #005bb5;
  }
</style>