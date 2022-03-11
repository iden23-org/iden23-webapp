<script setup lang="ts">
import {onMounted, ref} from 'vue'
import wallet, {EthersApiRateLimit} from '../services/wallet'
import {InstagramProofValue, Proof} from '../models/proof'
import proofManager from '../services/proof-manager'

const props = defineProps<{ contractAddress: string }>()

const walletAddress = ref('')
const validProofs = ref<Proof[]>([])

const getProofRepresentation = (proof: Proof) => {
  if (proof.type === 'domain') {
    return proof.value
  } else if (proof.type === 'instagram') {
    const parsedValue = JSON.parse(proof.value) as InstagramProofValue
    return parsedValue.profile
  }
}

onMounted(async () => {
  try {
    walletAddress.value = await wallet.getContractCreatorAddress(props.contractAddress)
  } catch (e) {
    if (e instanceof EthersApiRateLimit) {
      alert('You can only access this page once every 5 seconds')
      return
    }
    throw e
  }
  if (!walletAddress.value) {
    alert('Could not find the contract')
    return
  }
  const proofs = await wallet.getProofs(walletAddress.value)
  for (const p of proofs) {
    if (!(await proofManager.validateProof(p, walletAddress.value))) {
      continue
    }
    validProofs.value.push(p)
  }

})

</script>

<template>
  <h2>Linked profiles for {{ walletAddress }}</h2>
  <h3 v-for="p in validProofs"><a href="#">{{ getProofRepresentation(p) }}</a></h3>
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
