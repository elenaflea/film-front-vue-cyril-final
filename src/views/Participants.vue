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

// je stocke dans une variable la valeur de base de l'objet participant (afin de reinitialiser plus facilement)

// participant : variable de notre modèle qui va servir pour recupérer les paramètres de mon formulaire
const participant = ref({
  prenom : '',
  nom : ''
})

// listeparticipants : variable de notre modèle qui va servir pour recupérer les participants renvoyées par l'API et afficher la table dans le template
const listeparticipants = ref([])

// listeErreurs : variable de notre modèle qui va servir pour afficher les erreurs éventuelles dans le template
const listeErreurs = ref([])

/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/


/**
 * Cette méthode envoie une requête HTTP PUT à l'API 
 * Elle est appelée lorsque la table emet un événement emit('edit')
 */
async function edit(participant){
    await axios.put(`/participants/${participant.id}`, participant)
    recupererparticipants()
}


/**
 * Cette méthode envoie une requête HTTP DELETE à l'API 
 * Elle est appelée lorsque la table emet un événement emit('delete')
 */
async function remove(participant){
    await axios.delete(`http://localhost:8080/api/participants/${participant.id}`, participant)
    recupererparticipants()
}


/**
 * Cette méthode envoie une requête HTTP POST à l'API en passant en apramètre la valeur de notre modèle : participant
 * => ca va créer une participant en base de données via l'API
 * pour envoyer la requête HTTP, on va utiliser la librairie axios : https://axios-http.com/fr/docs/intro
 */
async function creerparticipant(){

  try {

    // on veut passer dans le corps de la requête HTTP le JSON correspondant à la valeur de notre modèle : participant
    await axios.post('http://localhost:8080/api/participants', participant.value)

    // si jamais on n'a pas d'erreur
    // on vide la variable listeErreurs
    listeErreurs.value = []

    // une fois qu'on a ajouté la participant, on recharge la liste des participants
    recupererparticipants()

    // on reinitialise le formulaire
    participant.value.prenom = ''
    participant.value.nom = ''
  }
    catch (error){
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error.response.data.errors
  }
}


/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste de toutes les participants
 * Ensuite, on va mettre à jour la valeur de la variable "listeparticipants" de notre modèle
 */
async function recupererparticipants(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('http://localhost:8080/api/participants')

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listeparticipants.value = reponseHTTP.data

}

// code qui va être appelé lorsque le composant est chargé (pas besoin de mettre async car on a pas d'autres traitements que recupererparticipants())
onMounted(() => {
    // on recupère la liste des participants à l'initialisation de l'application
    recupererparticipants()
});

</script>

<template>

  <main>

    <!--on affiche erreurs éventuelles (ne s'affiche que si la liste d'erreur n'est pas vide) -->
    <ErrorsDisplay :errors="listeErreurs"/>

    <h1>Ajout participant</h1>
    
    <!--
        Je vais créer une balise form juste pour des raisons sémantiques (accessibilité, référencement par les moteurs de recherche)
        Il ne va pas être validé car je vais lancer les requeêtes POST avec javascript 
     -->
    <form>

        <!-- FormTextElement est un composant définie dans components/FormTextElement.vue :
            il va prendre en paramètres des propriétés (props) :
            - label (valeur = texte): correspond à ce qu'on va afficher dans <label>{{ label }} </label>
            - object (valeur = reference, donc on mets : devant) : correspond à une reférence de l'objet que je veux modifier dans mon composant
            ici la reference a été déclarée en havascript (plus haut) avec const participant = ref({....}
            - field (valeur = texte) : correspond au champs de l'objet que je vais vouloir éditer à travers ce composant
        -->
        <FormTextElement label="Prénom" :object="participant" field="prenom"/>

        <FormTextElement label="Nom" :object="participant" field="nom"/>
        
        <!-- 
            on ne veut pas valider le formulaire quand on clique sur le bouton , donc il faut rajouter type="button" 
            par contre, je veux appeler lorsqu'on clique dessus une méthode Javascript : creerparticipant ( @click="creerparticipant")
        -->
        <button type="button" @click="creerparticipant">Créer participant</button>
    </form>


  <h2>Liste des participants</h2>

  <!-- TableElement est un composant définie dans components/TableElement.vue :
        il va prendre en paramètres des propriétés (props) :
            - labels (valeur = liste de Strings): correspond aux th de la table 
            - fields (valeur = liste de Strings): correspond aux attributs à afficher pour chaque élémentd e ma liste
            - listeModel (valeur = référence vers une liste définie dans le javascript avec : const listeparticipants = ref([])):
             correspond à la référence vers la variable du modèle pour laquelle on souhaite afficher le tableau

    @edit="(participant) => edit(participant)"
    lorsque TableElement va envoyer un événement emit('edit'), je vais appeler la méthode edit(participant) définie plus haut

    @delete="(participant) => remove(participant)"
    lorsque TableElement va envoyer un événement emit('delete'), je vais appeler la méthode remove(participant) définie plus haut
    -->
  <TableElement     
    @edit="(participant) => edit(participant)" 
    @delete="(participant) => remove(participant)" 
    :labels="['Prénom', 'Nom']" 
    :fields="['prenom', 'nom']" 
    :listeModel="listeparticipants" />



  </main>
</template>
