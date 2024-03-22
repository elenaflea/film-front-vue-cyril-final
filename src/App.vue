<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, provide } from 'vue'
import axios from '@/axios/instance'
/********************************
 *  Initialisation du modèle ****
 *********************************/

// membre : va être utilisé referencé le membre connecté
const membre = ref({})
// je rends disponible la variable membre pour les sous-composants
// je pourrai recuperer le membre dans les sous-composants avec :
// import { inject } from 'vue'
// const membre = inject('membreConnecte')
provide('membreConnecte', membre)

/**
 * On se déconnexte de l'application
 * =
 - on supprime le jwt du localstorage
 - on réinitialise la variable du modèle membre
 */
function logout(){
  // on supprime le jwt du localstorage
  localStorage.removeItem('jwt')
  // on réinitialise la variable du modèle membre
  membre.value = {}
}


/**
 * A l'initialisation de l'application
 * On va chercher les infos de l'utilisateur connecté
 */
async function init(){
  try {
    // va chercher les informations de l'utilisateur courant connexté (à partir de l'API)
    const result = await axios.get('/user')
    // si tout se passe bien, 
    // on met à jour le modèle "membre"
    membre.value = result.data



    
  } catch (error) {
    console.log('erreur lors de la récupération du membre', error);
  }
}
   // on définit ici que quand le composant se charge (onMounted), on appelle la méthode init()
  onMounted(() => {
    init()
})
</script>

<!-- 
  Ce template correspond à notre layout principal qui sera partagé par toutes les vues de l'application
  Les différentes pages vont être chargées à la place du composant  <RouterView /> (bas de page) 
-->
<template>
  <header>
    <h1 class="header-title">
        <!-- les fichiers qui sont à la racine du dossier static sont accessibles à la racine de l'application via : http://localhost:8080/nomFichier -->
        <img src="./assets/images/logoFilmotheque.png">
        <RouterLink to="/">Filmothèque</RouterLink>
    </h1>


    <!-- sémantiquement, on représente une partie navigation (<nav>) avec à l'interieur une liste (<ul>) de liens (<a>) -->
    <nav>
        <ul>
            <li>
              <RouterLink to="/films">Films</RouterLink>
              <!-- va génerer : <a href="/films">Films</a> -->
            </li>
            <li>
              <RouterLink v-if="membre.admin" to="/films/creer">Créer Film</RouterLink>
            </li>
            <li>
              <RouterLink v-if="membre.admin" to="/genres">Genres</RouterLink>
            </li>
            <li>
              <RouterLink v-if="membre.admin" to="/participants">Participants</RouterLink>
            </li>
            <li>
              <RouterLink v-if="membre.admin" to="/membres">Membres</RouterLink>
            </li>
        </ul>
    </nav>



    
    
    <section v-if="membre.id">
      <button class="link-button error-link" @click="logout">Déconnecter {{ membre.pseudo }} </button>
      </section>
      <section v-else>
        <nav>
        <RouterLink class="link-button" to="/login">Login</RouterLink>
      </nav>
      </section>
  </header>

<!-- 
    Notre balise  <RouterView /> correspond à layout:fragment="content" de thymeleaf
  => elle va être remplacée par le composant Vue qui correspond à l'url courante 
    Ces composants sont specifiés dans : router/index.js
 Je vais charger à cet endroit le composant Vue qui correspond à la route courante (en fonction de l'url sur laquelle on est) -->
  <RouterView @login="init" /> <!-- @login : quand l'événement "login" est émit depuis un sous composant, on rappelle la méthode init() -->

</template>
