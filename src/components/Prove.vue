<script setup lang="ts">
import {ref} from 'vue'
import ProveDomain from './ProveDomain.vue'
import ProveInstagram from './ProveInstagram.vue'
import {ProofType} from '../models/proof'

defineProps<{ msg: string }>()

const selectedType = ref<ProofType | ''>('')
const types = [
  { text: 'Domain', value: 'domain' },
  { text: 'Instagram (coming soon)', value: 'instagram', disabled: true },
  { text: 'Twitter (coming soon)', value: 'twitter', disabled: true },
]

</script>

<template>
  <b-form-group label="Choose a profile type" v-slot="{ ariaDescribedby }">
    <b-form-radio-group
        id="btn-radios-1"
        v-model="selectedType"
        :options="types"
        :aria-describedby="ariaDescribedby"
        name="radios-btn-default"
        buttons
    ></b-form-radio-group>
  </b-form-group>

  <ProveDomain v-if="selectedType === 'domain'"></ProveDomain>
  <ProveInstagram v-if="selectedType === 'instagram'"></ProveInstagram>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
