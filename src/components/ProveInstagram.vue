<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import wallet from '../services/wallet'
import proofManager from '../services/proof-manager'

const profile = ref('')
const walletAddress = ref('')
const postUrl = ref('')
const postValid = ref(false)
const validationMessage = ref('')
const showInstructions = ref(false)
const submittingProof = ref(false)

const proofString = computed(() => {
  return proofManager.createInstagramProofString(walletAddress.value)
})
const getWalletAddress = async () => {
  walletAddress.value = await wallet.getAccountAddress()
}

onMounted(async () => {
  walletAddress.value = await wallet.getAccountAddress()
})

const getProofValue = () => {
  return JSON.stringify({profile: profile.value, postUrl: postUrl.value})
}

const addProof = async () => {
  try {
    submittingProof.value = true
    await wallet.addProof('instagram', getProofValue())
    alert('Proof submitted')
    window.location.reload()
  } catch (e) {
    alert('Could not send the proof: ' + (e as Error).message)
  } finally {
    submittingProof.value = false
  }
}


const checkPost = async () => {
  const proofValue = getProofValue()
  postValid.value = await proofManager.validateProof({
    type: 'instagram',
    value: proofValue,
  }, walletAddress.value)
  if (!postValid.value) {
    validationMessage.value = 'Could not validate the post. Please make sure the post caption has the given string!'
  }
}

const getInstructions = async () => {
  try {
    const proofs = await wallet.getProofs(walletAddress.value)
    validationMessage.value = ''
    for (const proof of proofs) {
      if (proof.type === 'instagram' && JSON.parse(proof.value).profile === profile.value) {
        validationMessage.value = 'There is already a proof on this instagram for this wallet.'
        return
      }
    }
  } catch (e) {
    if ((e as Error).message.includes('invalid address')) {
      validationMessage.value = 'Wallet address is not valid'
      return
    }
  }

  showInstructions.value = true
}
</script>

<template>
  <h2>Link an instagram profile</h2>
  <b-container>
    <b-row>
      <b-col>
        <label>Instagram profile</label>
        <b-form-input v-model="profile" placeholder="willsmith"></b-form-input>
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
          <p>Post an instagram with the following text in the caption</p>
          <p><span>{{ proofString }}</span></p>
          <label>Post url</label>
          <div class="mb-3">
            <b-form-input placeholder="https://instagram.com/abcd" v-model="postUrl" />
          </div>

          <b-button variant="outline-primary" @click="checkPost">Validate</b-button>
        </div>
        <div v-if="postValid">
          <p class="mt-3">Well done! Now need to store the proof on the chain.</p>
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
