<script setup>
import axios from '@/axios/instance'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'





/********************************
 *  Initialisation du modèle ****
 *********************************/

// listeAviss : va être utilisée pour remplir notre table
const avis = ref({})
const film = ref({})


/**
 * init() : vide le formulaire et recharge les données du Avis
 */

async function init() {
  const idFilm = useRoute().params.id
  const result = await axios.get(`/films/${idFilm}`)
  film.value = result.data
}

/**
 * Cette méthode reviens sur la page précédente
 */

/**
 * creerFilm() : est appelée lorsque j'appuie sur le bouton Valider du formulaire
 */

 async function creerAvis(){
  /*
  * utilisation d'axios : nécessite de faire un "npm install axios" pour installer la librairie et de faire dans le script : import axios from 'axios'
  * axios.post(URL, data) va envoyer les données data au format json à l'api d'url : URL
  * 
  * Avis.value correspond à la valeur de l'objet Avis de notre modèle (mis à jour par le formulaire)
  * 
  * await : permet d'attendre que la requête ait recuperé la réponse avant de passer à l'instruction suivante
  */
  try {
    console.log('film', `films/${film.value.id}/avis` );
    
    await axios.post(`films/${film.value.id}/avis`, avis.value)
    await router.push(`/films/${film.value.id}`) // si tout se passe bien, je vais sur page de détail du film
  } catch (error) {
    console.log('error', error);
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

    <h1>Avis pour le film {{ film.titre }}</h1>

    <form>
      <!-- Note -->
      <div class="form-element">
        <label>Note</label>
        <!-- on peut référencer les propriétés de notre composant en utilisant le prefixe : props -->
        <input type="number" v-model="avis.note">
      </div>

      <!-- Commentaire -->
      <div class="form-element">
        <label>Commentaire</label>
        <textarea rows="5" cols="30" v-model="avis.commentaire"></textarea>
      </div>
      <button type="button" @click="creerAvis">Creer</button>      
      <button type="button" @click="cancel" class="link-button cancel-button">annuler</button>
    </form>

  </main>
</template>
