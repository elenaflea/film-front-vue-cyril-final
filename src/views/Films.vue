<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios/instance'
import { inject } from 'vue'
import SelectTextElement from '@/components/SelectTextElement.vue'
// je recupère le membre qui a été "providé" dans App.vue avec : provide('membreConnecte', membre)
const membre = inject('membreConnecte')




/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/

// ref() permet de réer une référence vers une variable de notre modèle qui sera acccessible dans le template
// on initialise la valeur (.value) de cette variable avec un objet initialisé avec des paramètres vides

// je stocke dans une variable la valeur de base de l'objet film (afin de reinitialiser plus facilement)


// listeFilms : variable de notre modèle qui va servir pour recupérer les films renvoyées par l'API et afficher la table dans le template
const listeFilms= ref([])
const listeGenres = ref([])


// parametresRecherche : variable de notre modèle qui va servir pour gérer les paramètres de recherche
const parametresRecherche = ref({
  idGenre:""
})

/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/


/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste de toutes les films
 * Ensuite, on va mettre à jour la valeur de la variable "listeFilms" de notre modèle
 */
async function recupererfilms(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('/films')

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listeFilms.value = reponseHTTP.data
}

/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste de toutes les genres
 * Ensuite, on va mettre à jour la valeur de la variable "listegenres" de notre modèle
 */
 async function recuperergenres(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('/genres')

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listeGenres.value = reponseHTTP.data

}

/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste des films filtrés à partir des paramètres de recherche
 * Ensuite, on va mettre à jour la valeur de la variable "listeFilms" de notre modèle
 */
 async function rechercher(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('/films', {params:parametresRecherche.value} )

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listeFilms.value = reponseHTTP.data

}



// code qui va être appelé lorsque le composant est chargé (pas besoin de mettre async car on a pas d'autres traitements que recupererfilms())
onMounted(() => {
    // on recupère la liste des films à l'initialisation de l'application
    recupererfilms()
    recuperergenres()
});

</script>

<template>

  <main>

   
  <h2>Liste des films</h2>

  
 <!-- Formulaire de recherche - rempli et envoie un objet de type ParametresRecherche car on amis th:object="${parametresRecherche} -->
 <form id="search-form">
        <h3>Filtres : </h3>
        
        <SelectTextElement :object="parametresRecherche" field="idGenre" :options="listeGenres" :displayElement="genre => genre.titre" @change="rechercher" defaultOptionLabel="-- Tous les Genres --" defaultOptionEnabled="true"/>

        <div class="form-element">
            <label>Année</label>
            <input type="number" v-model="parametresRecherche.anneeMin" placeholder="année Min">
            <input type="number" v-model="parametresRecherche.anneeMax" placeholder="année Max">
        </div>
        <div class="form-element">
            <label>Durée</label>
            <input type="number" v-model="parametresRecherche.dureeMin" placeholder="durée Min">
            <input type="number" v-model="parametresRecherche.dureeMax" placeholder="durée Max">
        </div>
        
        <input v-model="parametresRecherche.search" type="text" placeholder="rechercher par titre, genre, réalisateur">
        <button type="button" @click="rechercher">Valider</button>
    </form>


    <table>
        <thead>
            <tr>
                <th>Genre</th>
                <th>Année</th>
                <th>Titre</th>
                <th>Réalisateur</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <!--
                 je vais créer une ligne <tr> pour CHAQUE film de mon modèle 
                avec v-for sur l'attribut de modèle "listeFilms" ajouté dans le controller avec : model.addAttribute("listeFilms", ...)
            -->
            <tr v-for="film in listeFilms">
                <td>{{ film.genre.titre }}</td>
                <td>{{film.annee}}</td>
                <td>{{film.titre}}</td>
                <td>{{film.realisateur.prenom}} {{film.realisateur.nom}}</td>
                <td>
                  <!-- avec :to, on peut avoir un attribut dynamique avec le filmId -->
                  <RouterLink :to="`/films/${film.id}`" class="link-button">Détail</RouterLink>                  
                  <RouterLink v-if="membre.admin" :to="`/films/${film.id}/edit`" class="link-button edit-button">Modifier</RouterLink>
                  <RouterLink v-if="membre.id" :to="`/films/${film.id}/avis`" class="link-button bonus-button">Ajouter un avis</RouterLink>
                  <RouterLink v-if="membre.admin" :to="`/films/${film.id}/delete`" message="tttt" class="link-button delete-button">Supprimer</RouterLink>
                </td>
            </tr>
        </tbody>
        
    </table>



  </main>
</template>
