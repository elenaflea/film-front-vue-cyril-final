<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { inject } from 'vue'
 const membre = inject('membreConnecte')
</script>

<template>
  <main class="flex-center">
    <div>
    <h2>Bienvenue {{ membre.prenom }} !</h2>
    <p>Voici l'application de gestion des films que tout le monde attendait</p>
  </div>
  </main>
</template>
