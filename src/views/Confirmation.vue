<script setup>
import axios from '@/axios/instance'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'





/********************************
 *  Initialisation du modèle ****
 *********************************/
 const film = ref({}) 
/**
 * init() : vide le formulaire et recharge les données du film
 */


 /********************************
 * Fonctions ****
 *********************************/
/**
 * Cette méthode envoie une requête HTTP DELETE à l'API 
 */
 async function remove(){
    await axios.delete(`/films/${film.value.id}`)
    await router.push('/films')
}

/**
 * Cette méthode reviens sur la page précédente
 */
async function cancel(){
    router.back() // permet de revenir à la route précédente
}

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

<h2>Etes vous sur de vouloir supprimer le film : {{ film.titre }}</h2>
    
    <form class="confirmation-form">
        <button type="button" @click="remove" class="confirm-button">Je confirme</button>
        <button type="button" @click="cancel" class="link-button cancel-button">annuler</button>
    </form>
</template>