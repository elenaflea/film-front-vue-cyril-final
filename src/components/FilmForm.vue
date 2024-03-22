<script setup>

import axios from '@/axios/instance'
import { ref, onMounted } from 'vue'
import FormTextElement from '@/components/FormTextElement.vue'
import SelectTextElement from '@/components/SelectTextElement.vue'
import FormTextAreaElement from '@/components/FormTextAreaElement.vue' 
import ErrorsDisplay from '@/components/ErrorsDisplay.vue'

// on définit les propriétés qu'on peut passer lorsqu'on écrit  <FilmForm :film="film" ....
const props = defineProps(['film', 'viewOnly'])

// listeGenres : va être utilisé pour remplir notre table
const genres = ref([])
const participants = ref([])

// errors : va être utilisé pour lister nos erreurs
const errors = ref([])


async function init() {

    // initialise la liste des Genres
    let reponseHTTP = await axios.get('/genres')
    genres.value = reponseHTTP.data

    // initialise la liste des Participants
    reponseHTTP = await axios.get('/participants')
    participants.value = reponseHTTP.data
}

 // on définit ici que quand le composant se charge (onMounted), on appelle la méthode init()
 onMounted(() => {
  init()
})
</script>


<template>

    <!-- Titre -->
    <FormTextElement label="Titre" :object="film" field="titre" :disabled="props.viewOnly"/>

    <!-- Annee -->
    <FormTextElement label="Annee" :object="film" field="annee" :disabled="props.viewOnly"/>

    <!-- Genre -->
    <SelectTextElement v-if="film.genre" label="Genre" :object="film.genre" field="id" :options="genres" :disabled="props.viewOnly" :displayElement="genre => genre.titre" defaultOptionLabel="-- Tous les Genres --"/>

     <!-- Duree -->
     <FormTextElement label="Duree" :object="film" field="duree" :disabled="props.viewOnly"/>

     <!-- Realisateur -->
    <SelectTextElement v-if="film.realisateur" label="Realisateur" :object="film.realisateur" field="id" :options="participants" :disabled="props.viewOnly" :displayElement="participant => `${participant.prenom} ${participant.nom}`" defaultOptionLabel="-- Tous les Réalisateurs --"/>

    <!-- Acteurs -->
    <div class="form-element">
        <label>Acteurs</label>

        <!--
            si on est en vue de Modification
            j'affiche un bouton "+ ajouter" qui me permet d'ajouter un acteur à la liste film.acteurs
            ensuite, j'affiche une select box par acteur dans la liste (v-for="(acteur, index) in film.acteurs")
            avec en plus un bouton de suppression qui enlève l'acteur de la liste (et donc la select box)
         -->
        <template v-if="!props.viewOnly">
            <button type="button" @click="film.acteurs.push({id:''})" class="link-button edit-button"> + ajouter</button>
            <template v-for="(acteur, index) in film.acteurs">
                <SelectTextElement label=" " :object="acteur" field="id" :options="participants" :displayElement="participant => `${participant.prenom} ${participant.nom}`" defaultOptionLabel="-- Tous les Acteurs --">
                    <!-- on inclue du html qui sera mis à la place de la balise <slot/> dans le template de SelectTextElement -->
                    <button type="button" @click="film.acteurs.splice(index,1)" class="link-button delete-button">X</button>
                </SelectTextElement>
            </template>
        </template >

        <ul v-if="props.viewOnly" >
            <li v-for="acteur in film.acteurs">{{ acteur.prenom }} {{ acteur.nom }}</li>
        </ul>
    </div>

     <!-- Synopsis -->
     <FormTextAreaElement label="Synopsis" :object="film" field="synopsis" :disabled="props.viewOnly"/>

      <!-- Avis (affichage uniquement en vue détail) -->
      <div class="form-element" v-if="viewOnly && film.avis?.length > 0">
        <label>Avis</label>        
        <ul>
            <li v-for="avis in film.avis">{{ avis.commentaire  }} [{{avis.note}}] ({{avis.membre.prenom}} {{avis.membre.nom}})</li>
        </ul>      
    </div>
</template>