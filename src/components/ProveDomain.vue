<script setup lang="ts">
import {computed, ref} from 'vue'
import wallet from '../services/wallet'
import proofManager from '../services/proof-manager'

const domain = ref('')
const dnsValid = ref(false)
const walletAddress = ref('')
const validationMessage = ref('')
const showInstructions = ref(false)
const submittingProof = ref(false)

const getWalletAddress = async () => {
  walletAddress.value = await wallet.getAccountAddress()
}

const proofString = computed(() => {
  return proofManager.createDomainProofString(walletAddress.value)
})

const checkDns = async () => {
  validationMessage.value = ''
  dnsValid.value = await proofManager.validateProof({
    type: 'domain',
    value: domain.value
  }, walletAddress.value)
  if (!dnsValid.value) {
    validationMessage.value = 'Record not found yet. Please wait a minute and then try again!'
  }
}

const addProof = async () => {
  try {
    submittingProof.value = true
    await wallet.addProof('domain', domain.value)
    alert('Proof submitted')
    window.location.reload()
  } catch (e) {
    alert('Could not send the proof: ' + (e as Error).message)
  } finally {
    submittingProof.value = false
  }
}

const getInstructions = async () => {
  const proofs = await wallet.getProofs(walletAddress.value)
  validationMessage.value = ''
  for (const proof of proofs) {
    if (proof.type === 'domain' && proof.value === domain.value) {
      validationMessage.value = 'There is already a proof on this domain for this wallet.'
      return
    }
  }
  showInstructions.value = true
}
</script>

<template>
  <h2>Link a domain</h2>
  <b-container>
    <b-row>
      <b-col>
        <label>Domain</label>
        <b-form-input v-model="domain" placeholder="example.com"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <label>Wallet address</label>
        <b-form-input v-model="walletAddress" placeholder="0x"></b-form-input>
        <b-button class="mt-2" variant="outline-primary" @click="getWalletAddress">Use my wallet</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button class="mt-2" variant="outline-primary" @click="getInstructions">Show instructions</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <div v-if="showInstructions">
          <p>Go to your dns provider.</p>
          <p>Put the following txt record on {{ domain }} </p>
          <p><span>{{ proofString }}</span></p>
          <b-button variant="outline-primary" @click="checkDns">Validate</b-button>
        </div>
        <div v-if="dnsValid">
          <p class="mt-3">Well done! Now need to store the proof on the chain. Make sure you sign the transaction with the same wallet you provided.</p>
          <p>Can't sign the transaction with that wallet from your computer? No worries! Follow the instructions <router-link target="_blank" to="manual_proof_submit">here</router-link> to submit your proof!</p>
          <b-button variant="success" :disabled="submittingProof" @click="addProof">Add proof to store</b-button>
        </div>
        <b-alert :show="submittingProof" show class="mt-3" variant="info">Submitting the proof. Please wait!</b-alert>
        <b-alert :show="!!validationMessage" show class="mt-3" variant="danger">{{ validationMessage }}</b-alert>
      </b-col>
    </b-row>
  </b-container>
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
