<script setup>
import axios from '@/axios/instance'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FilmForm from '@/components/FilmForm.vue'
import ErrorsDisplay from '@/components/ErrorsDisplay.vue'
import router from '@/router'





/********************************
 *  Initialisation du modèle ****
 *********************************/

// listeFilms : va être utilisée pour remplir notre table
const film = ref({})
// listeErreurs : variable de notre modèle qui va servir pour afficher les erreurs éventuelles dans le template
const listeErreurs = ref([])

/**
 * init() : vide le formulaire et recharge les données du film
 */

 async function init(){
  const idFilm = useRoute().params.id
  const result = await axios.get(`/films/${idFilm}`)
  film.value = result.data
 }

 /**
 * creerFilm() : est appelée lorsque j'appuie sur le bouton Valider du formulaire
 */

 async function modifierFilm(){
  /*  
  * utilisation d'axios : nécessite de faire un "npm install axios" pour installer la librairie et de faire dans le script : import axios from 'axios'
  * axios.post(URL, data) va envoyer les données data au format json à l'api d'url : URL
  * 
  * Genre.value correspond à la valeur de l'objet Genre de notre modèle (mis à jour par le formulaire)
  * 
  * await : permet d'attendre que la requête ait recuperé la réponse avant de passer à l'instruction suivante
  */

  try {
    await axios.put(`/films/${film.value.id}`, film.value)
    router.push(`/films/${film.value.id}`) // si tout se passe bien, je vais sur la liste de détail du film
  } 
  catch (error){
    console.log('error', error)
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error?.response?.data?.errors
  }
}

/**
 * Cette méthode reviens sur la page précédente
 */
 async function cancel(){
    router.back()
}

 // on définit ici que quand le composant se charge (onMounted), on appelle la méthode init()
onMounted(() => {
  init()
})
</script>

<template>
  <main>

    <h1>Modification du film {{ film.titre }}</h1>

    <!--on affiche erreurs éventuelles (ne s'affiche que si la liste d'erreur n'est pas vide) -->
    <ErrorsDisplay :errors="listeErreurs"/>
     

    <form>
     <!-- 
      on réutilise le composant  FilmForm sur la vue de détail ET sur le formulaire de création 
      :film="film" équivaut à th:film="${film}" => on passe une porpriété "film" au composant qui va prendren la valeur de l'attribut de modèle "film"
        -->
    <FilmForm v-if="film" :film="film"></FilmForm>
    <button type="button" @click="modifierFilm">Modifier</button>    
    <button type="button" @click="cancel" class="link-button cancel-button">annuler</button>
  </form>
  </main>
</template>
