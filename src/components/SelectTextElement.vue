<script setup>
// pour pouvoir utiliser des propriétés sur nos composant, je suis obligé de les définir avec la méthode defineProps
// une fois que c'est défini, je peux les utiliser dans mon template comme des varaibles de mon modèle
defineProps(['label', 'object', 'field', 'options', 'displayElement', 'disabled', 'defaultOptionLabel', 'defaultOptionEnabled'])
const emit = defineEmits(['change'])
</script>



<template>
     <div class="form-element">
            <label v-if="label">{{label}} </label>
            <!-- v-model="object[field]" : ce champs de saisie modifie l'attribut correspondant à la prop "field", de la référence au modèle correspondant à la porporiété "object" -->
            <select  v-model="object[field]" :disabled="disabled" @change="emit('change')">
            <!-- je mets une option par défaut -->
            <option :disabled="!defaultOptionEnabled" value="" > {{defaultOptionLabel || '--Tous les éléments --'}}</option>
            <!-- 
            je crée dynamiquement mes balises options à partir de la liste passée en propriété
            -->
                <option v-for=" option in options" :value="option.id">{{ displayElement(option) }} </option>                
        </select>
         <!-- on va remplacer <slot/> par le code à l'intérieur de la balise <SelectTextElement></SelectTextElement> -->
        <slot/>
        </div>
</template>