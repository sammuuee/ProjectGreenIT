<template>
    <div class="penalty-container">
      <h1>Penalty Game ⚽</h1>
      <p>Bienvenue dans le mini-jeu !</p>
      <button @click="$emit('back')">Retour au Chat</button>
    </div>
</template>
  
<script>
  export default {
    props: ['user', 'friendId', 'serverUrl'],
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
    margin-top: 20px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
  }
  button:hover {
    background-color: #005bb5;
  }
</style>