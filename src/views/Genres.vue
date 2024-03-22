<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios/instance'
import FormTextElement from '@/components/FormTextElement.vue'
import TableElement from '@/components/TableElement.vue'
import ErrorsDisplay from '@/components/ErrorsDisplay.vue'




/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/

// ref() permet de réer une référence vers une variable de notre modèle qui sera acccessible dans le template
// on initialise la valeur (.value) de cette variable avec un objet initialisé avec des paramètres vides

// je stocke dans une variable la valeur de base de l'objet genre (afin de reinitialiser plus facilement)

// genre : variable de notre modèle qui va servir pour recupérer les paramètres de mon formulaire
const genre = ref({
  titre : ''
})

// listegenres : variable de notre modèle qui va servir pour recupérer les genres renvoyées par l'API et afficher la table dans le template
const listegenres = ref([])

// listeErreurs : variable de notre modèle qui va servir pour afficher les erreurs éventuelles dans le template
const listeErreurs = ref([])


/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/


/**
 * Cette méthode envoie une requête HTTP PUT à l'API 
 * Elle est appelée lorsque la table emet un événement emit('edit')
 */
async function edit(genre){
    await axios.put(`/genres/${genre.id}`, genre)
    recuperergenres()
}


/**
 * Cette méthode envoie une requête HTTP DELETE à l'API 
 * Elle est appelée lorsque la table emet un événement emit('delete')
 */
async function remove(genre){
    await axios.delete(`/genres/${genre.id}`, genre)
    recuperergenres()
}


/**
 * Cette méthode envoie une requête HTTP POST à l'API en passant en apramètre la valeur de notre modèle : genre
 * => ca va créer une genre en base de données via l'API
 * pour envoyer la requête HTTP, on va utiliser la librairie axios : https://axios-http.com/fr/docs/intro
 */
async function creergenre(){


  try {
    // on veut passer dans le corps de la requête HTTP le JSON correspondant à la valeur de notre modèle : genre
    await axios.post('/genres', genre.value)
     // si jamais on n'a pas d'erreur
    // on vide la variable listeErreurs
    listeErreurs.value = []
  }

  catch (error){
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error.response.data.errors
  }

    

    // une fois qu'on a ajouté la genre, on recharge la liste des genres
    recuperergenres()

    // on reinitialise le formulaire
    genre.value.titre = ''
}


/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste de toutes les genres
 * Ensuite, on va mettre à jour la valeur de la variable "listegenres" de notre modèle
 */
async function recuperergenres(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('/genres')

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listegenres.value = reponseHTTP.data

}

// code qui va être appelé lorsque le composant est chargé (pas besoin de mettre async car on a pas d'autres traitements que recuperergenres())
onMounted(() => {
    // on recupère la liste des genres à l'initialisation de l'application
    recuperergenres()
});

</script>

<template>

  <main>

    <h1>Ajout genre</h1>

    <!--on affiche erreurs éventuelles (ne s'affiche que si la liste d'erreur n'est pas vide) -->
    <ErrorsDisplay :errors="listeErreurs"/>
    
    <!--
        Je vais créer une balise form juste pour des raisons sémantiques (accessibilité, référencement par les moteurs de recherche)
        Il ne va pas être validé car je vais lancer les requeêtes POST avec javascript 
     -->
    <form>

        <!-- FormTextElement est un composant définie dans components/FormTextElement.vue :
            il va prendre en paramètres des propriétés (props) :
            - label (valeur = texte): correspond à ce qu'on va afficher dans <label>{{ label }} </label>
            - object (valeur = reference, donc on mets : devant) : correspond à une reférence de l'objet que je veux modifier dans mon composant
            ici la reference a été déclarée en havascript (plus haut) avec const genre = ref({....}
            - field (valeur = texte) : correspond au champs de l'objet que je vais vouloir éditer à travers ce composant
        -->
        <FormTextElement label="Titre" :object="genre" field="titre"/>
        
        <!-- 
            on ne veut pas valider le formulaire quand on clique sur le bouton , donc il faut rajouter type="button" 
            par contre, je veux appeler lorsqu'on clique dessus une méthode Javascript : creergenre ( @click="creergenre")
        -->
        <button type="button" @click="creergenre">Créer genre</button>
    </form>


  <h2>Liste des genres</h2>

  <!-- TableElement est un composant définie dans components/TableElement.vue :
        il va prendre en paramètres des propriétés (props) :
            - labels (valeur = liste de Strings): correspond aux th de la table 
            - fields (valeur = liste de Strings): correspond aux attributs à afficher pour chaque élémentd e ma liste
            - listeModel (valeur = référence vers une liste définie dans le javascript avec : const listegenres = ref([])):
             correspond à la référence vers la variable du modèle pour laquelle on souhaite afficher le tableau

    @edit="(genre) => edit(genre)"
    lorsque TableElement va envoyer un événement emit('edit'), je vais appeler la méthode edit(genre) définie plus haut

    @delete="(genre) => remove(genre)"
    lorsque TableElement va envoyer un événement emit('delete'), je vais appeler la méthode remove(genre) définie plus haut
    -->
  <TableElement     
    @edit="(genre) => edit(genre)" 
    @delete="(genre) => remove(genre)" 
    :labels="['Titre']" 
    :fields="['titre']" 
    :listeModel="listegenres" />



  </main>
</template>
