<script setup>
import axios from '@/axios/instance'
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import FilmForm from '@/components/FilmForm.vue'
const membre = inject('membreConnecte')





/********************************
 *  Initialisation du modèle ****
 *********************************/

// listeFilms : va être utilisée pour remplir notre table
const film = ref({})


/**
 * init() : vide le formulaire et recharge les données du film
 */

 async function init(){
  const idFilm = useRoute().params.id
  const result = await axios.get(`/films/${idFilm}`)
  film.value = result.data
 }

 // on définit ici que quand le composant se charge (onMounted), on appelle la méthode init()
onMounted(() => {
  init()
})
</script>

<template>
  <main>
    <!-- avec :to, on peut avoir un attribut dynamique avec le filmId -->
    <RouterLink v-if="membre.id" :to="`/films/${film.id}/avis`" class="link-button bonus-button">Ajouter un avis</RouterLink>
    <RouterLink v-if="membre.admin" :to="`/films/${film.id}/edit`" class="link-button edit-button">Modifier</RouterLink>
    <RouterLink v-if="membre.admin" :to="`/films/${film.id}/delete`" message="tttt" class="link-button delete-button">Supprimer</RouterLink>

    <h1>Detail du film {{ film.titre }}</h1>

     <!--  on laisse la possibilité d'ajouter un avis-->
     
     <!-- 
      on réutilise le composant  FilmForm sur la vue de détail ET sur le formulaire de création 
      :film="film" équivaut à th:film="${film}" => on passe une porpriété "film" au composant qui va prendren la valeur de l'attribut de modèle "film"
        -->
    <FilmForm v-if="film" :film="film" viewOnly="true"></FilmForm>
  </main>
</template>
