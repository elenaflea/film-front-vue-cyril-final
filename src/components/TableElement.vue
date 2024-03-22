<script setup>

/**
 * PROPRIETES
 */
// pour pouvoir utiliser des propriétés sur nos composant, je suis obligé de les définir avec la méthode defineProps
// une fois que c'est défini, je peux les utiliser dans mon template comme des varaibles de mon modèle
const props = defineProps(['listeModel', 'labels', 'fields'])

/**
 * EVENEMENTS (je vais pouvoir emettre les évenements suivants depuis ce composant)
 * ces évènements seront interceptable par le composant parent avec l'attribut @edit @delete etc...
 */
const emit = defineEmits(['edit', 'delete'])

import { ref, onMounted } from 'vue'

const edit = ref()
</script>



<template>
     <table>
        <tr>
            <!-- je crée un th pour chaque label specifié dans la prop : labels -->
            <th v-for="label in labels">{{ label}}</th>
            <th></th>
        </tr>
        
        <!-- je crée une ligne pour chaque element de ma liste en model -->
        <tr v-for="element in listeModel" > 

                <!--
                    CAS n°1 - lorsqu'on est en mode "affichage" (par défaut) 
                    on affiche un sous-template qui affiche les données de l'élément + 2 boutons (modifier / supprimer) 
                -->
                <template  v-if="edit != element?.id">
                    <!-- pour chaque élément de ma liste : j'affiche chacun des champs specifié  dans la prop : fields -->
                    <td v-for="field in fields" >{{ element[field]}}</td>
                    <td>
                        <!-- boutons -->
                        <button  class="link-button" type="button" @click="edit=element.id">modifier</button>
                        <!-- 
                            lorsque j'appuie sur le bouton supprimer = ca emmet un évenement (emit('delete', element)) qui sera recupérable sur mon composant parent (App) avec @delete 
                            le composant parent pourra recupérer également la valeur de l'élément envoyé (ici cela va correspondre à l'objet de la ligne)
                        -->
                        <button  class="link-button delete-button" @click="emit('delete', element);" type="button">supprimer</button>
                    </td>
                </template>

                <!--
                    CAS n°2 - lorsqu'on est en mode "edit" 
                    on affiche un sous-template qui affiche des champs de saisie  + 2 boutons (valider / annuler) 
                -->
                <template v-else>
                    <!-- pour chaque élément de ma liste : j'affiche un champs de saisie texte correspondant à l'élément -->
                    <td v-for="field in fields" >
                        <input type="text" v-model="element[field]">
                    </td>
                    <td>
                        <!-- boutons -->
                        <!-- 
                            lorsque j'appuie sur le bouton valider = ca emmet un évenement (emit('edit', element)) qui sera recupérable sur mon composant parent (App) avec @delete 
                            le composant parent pourra recupérer également la valeur de l'élément envoyé (ici cela va correspondre à l'objet de la ligne)
                        -->
                        <button class="link-button" type="button" @click="emit('edit', element); edit = 0">Valider</button>
                        <button  class="link-button cancel-button" type="button" @click="edit=0">annuler</button>
                    </td>
                </template>
               
            
            </tr>
    </table>
</template>