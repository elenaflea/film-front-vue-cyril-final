<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios/instance'
import FormTextElement from '@/components/FormTextElement.vue'
import FormCheckBoxElement from '@/components/FormCheckBoxElement.vue'
FormCheckBoxElement
import TableElement from '@/components/TableElement.vue'
import ErrorsDisplay from '@/components/ErrorsDisplay.vue'




/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/

// ref() permet de réer une référence vers une variable de notre modèle qui sera acccessible dans le template
// on initialise la valeur (.value) de cette variable avec un objet initialisé avec des paramètres vides

// je stocke dans une variable la valeur de base de l'objet membre (afin de reinitialiser plus facilement)

// membre : variable de notre modèle qui va servir pour recupérer les paramètres de mon formulaire
const membre = ref({
  prenom : '',
  nom : '',
  pseudo : '',
  motDePasse : '',
  admin : false
})

// listemembres : variable de notre modèle qui va servir pour recupérer les membres renvoyées par l'API et afficher la table dans le template
const listemembres = ref([])

// listeErreurs : variable de notre modèle qui va servir pour afficher les erreurs éventuelles dans le template
const listeErreurs = ref([])


/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/


/**
 * Cette méthode envoie une requête HTTP PUT à l'API 
 * Elle est appelée lorsque la table emet un événement emit('edit')
 */
async function edit(membre){
    await axios.put(`/membres/${membre.id}`, membre)
    recuperermembres()
}


/**
 * Cette méthode envoie une requête HTTP DELETE à l'API 
 * Elle est appelée lorsque la table emet un événement emit('delete')
 */
async function remove(membre){
    await axios.delete(`/membres/${membre.id}`, membre)
    recuperermembres()
}


/**
 * Cette méthode envoie une requête HTTP POST à l'API en passant en apramètre la valeur de notre modèle : membre
 * => ca va créer une membre en base de données via l'API
 * pour envoyer la requête HTTP, on va utiliser la librairie axios : https://axios-http.com/fr/docs/intro
 */
async function creermembre(){

  try {
    // on veut passer dans le corps de la requête HTTP le JSON correspondant à la valeur de notre modèle : membre
    await axios.post('/membres', membre.value)
    
    // si jamais on n'a pas d'erreur
    // on vide la variable listeErreurs
    listeErreurs.value = []
 
    // une fois qu'on a ajouté la membre, on recharge la liste des membres
    recuperermembres()

    // on reinitialise le formulaire
    membre.value.prenom = ''
    membre.value.nom = ''
    membre.value.pseudo = ''
    membre.value.motDePasse = ''
    membre.value.admin = false
  }
    catch (error){
    // si jamais j'ai des erreur

    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche (si jamais il y en a)
    if (error.response.data.errors)
    listeErreurs.value = error.response.data.errors
  }
}


/**
 * Cette méthode envoie une requête HTTP GET à l'API pour recupérer la liste de toutes les membres
 * Ensuite, on va mettre à jour la valeur de la variable "listemembres" de notre modèle
 */
async function recuperermembres(){
    // on recupère une réponse HTTP en attendant qu'elle soit terminée (await)
    const reponseHTTP = await axios.get('/membres')

    // une fois qu'on a recuperé la réponse, on met à jour notre modèle avec les données de la réponse (.data) => le template va se mettre à jour automatiquement
    listemembres.value = reponseHTTP.data

}

// code qui va être appelé lorsque le composant est chargé (pas besoin de mettre async car on a pas d'autres traitements que recuperermembres())
onMounted(() => {
    // on recupère la liste des membres à l'initialisation de l'application
    recuperermembres()
});

</script>

<template>

  <main>

    <!--on affiche erreurs éventuelles (ne s'affiche que si la liste d'erreur n'est pas vide) -->
    <ErrorsDisplay :errors="listeErreurs"/>

    <h1>Ajout membre</h1>
    
    <!--
        Je vais créer une balise form juste pour des raisons sémantiques (accessibilité, référencement par les moteurs de recherche)
        Il ne va pas être validé car je vais lancer les requeêtes POST avec javascript 
     -->
    <form>

        <!-- FormTextElement est un composant définie dans components/FormTextElement.vue :
            il va prendre en paramètres des propriétés (props) :
            - label (valeur = texte): correspond à ce qu'on va afficher dans <label>{{ label }} </label>
            - object (valeur = reference, donc on mets : devant) : correspond à une reférence de l'objet que je veux modifier dans mon composant
            ici la reference a été déclarée en havascript (plus haut) avec const membre = ref({....}
            - field (valeur = texte) : correspond au champs de l'objet que je vais vouloir éditer à travers ce composant
        -->
        <FormTextElement label="Prénom" :object="membre" field="prenom"/>

        <FormTextElement label="Nom" :object="membre" field="nom"/>

        <FormTextElement label="Pseudo" :object="membre" field="pseudo"/>

        <FormTextElement label="Mot de passe" :object="membre" field="motDePasse"/>

        <FormCheckBoxElement label="Admin" :object="membre" field="admin"/>
        
        <!-- 
            on ne veut pas valider le formulaire quand on clique sur le bouton , donc il faut rajouter type="button" 
            par contre, je veux appeler lorsqu'on clique dessus une méthode Javascript : creermembre ( @click="creermembre")
        -->
        <button type="button" @click="creermembre">Créer membre</button>
    </form>


  <h2>Liste des membres</h2>

  <!-- TableElement est un composant définie dans components/TableElement.vue :
        il va prendre en paramètres des propriétés (props) :
            - labels (valeur = liste de Strings): correspond aux th de la table 
            - fields (valeur = liste de Strings): correspond aux attributs à afficher pour chaque élémentd e ma liste
            - listeModel (valeur = référence vers une liste définie dans le javascript avec : const listemembres = ref([])):
             correspond à la référence vers la variable du modèle pour laquelle on souhaite afficher le tableau

    @edit="(membre) => edit(membre)"
    lorsque TableElement va envoyer un événement emit('edit'), je vais appeler la méthode edit(membre) définie plus haut

    @delete="(membre) => remove(membre)"
    lorsque TableElement va envoyer un événement emit('delete'), je vais appeler la méthode remove(membre) définie plus haut
    -->
  <TableElement     
    @edit="(membre) => edit(membre)" 
    @delete="(membre) => remove(membre)" 
    :labels="['Prénom', 'Nom']" 
    :fields="['prenom', 'nom']" 
    :listeModel="listemembres" />



  </main>
</template>
