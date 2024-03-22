<script setup>

import axios from '@/axios/instance'
import { ref, onMounted } from 'vue'
import FilmForm from '@/components/FilmForm.vue'
import router from '@/router'
import ErrorsDisplay from '@/components/ErrorsDisplay.vue'

/********************************
 *  Initialisation du modèle ****
 *********************************/

// Film : va être utilisé pour remplir notre formulaire
const film = ref({
  prenom : '',
  nom : '',
  genre:{id:""},
  realisateur:{id:""},
  acteurs:[]
})

// listeErreurs : variable de notre modèle qui va servir pour afficher les erreurs éventuelles dans le template
const listeErreurs = ref([])


/********************************
 ****** FONCTIONS ****************
 *********************************/


/**
 * creerFilm() : est appelée lorsque j'appuie sur le bouton Valider du formulaire
 */

 async function creerFilm(){
  /*
  * utilisation d'axios : nécessite de faire un "npm install axios" pour installer la librairie et de faire dans le script : import axios from 'axios'
  * axios.post(URL, data) va envoyer les données data au format json à l'api d'url : URL
  * 
  * Genre.value correspond à la valeur de l'objet Genre de notre modèle (mis à jour par le formulaire)
  * 
  * await : permet d'attendre que la requête ait recuperé la réponse avant de passer à l'instruction suivante
  */
  try {
    await axios.post('/films', film.value)
    await router.push('/films') // si tout se passe bien, je vais sur la liste des films
  } 
  catch (error){
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error.response.data.errors
  }

  
}

/**
 * Cette méthode reviens sur la page précédente
 */
 async function cancel(){
    router.back()
}
  



</script>

<template>
  <main>
    <h1>Page CreerFilm</h1>

    <!--on affiche erreurs éventuelles (ne s'affiche que si la liste d'erreur n'est pas vide) -->
    <ErrorsDisplay :errors="listeErreurs"/>

   <form>
    <!-- 
      on réutilise le composant  FilmForm sur la vue de détail ET sur le formulaire de création 
      :film="film" équivaut à th:film="${film}" => on passe une porpriété "film" au composant qui va prendren la valeur de l'attribut de modèle "film"
    -->
    <FilmForm :film="film"></FilmForm>
    <button type="button" @click="creerFilm">Creer</button>    
    <button type="button" @click="cancel" class="link-button cancel-button">annuler</button>
   </form>
    
  </main>
</template>
