<script setup lang="ts">
import wallet from '../services/wallet'

const proofStoreAddress = wallet.proofStoreAddress
</script>

<template>
  <p>
    You are reading this help because you can not use your wallet on this website.
  </p>
  <p>
    The proofs for Iden23 are stored on a smart contract which means if you can sign transactions with your wallet then you can store a proof as well.
    Here are the details on how you can submit your proof in that smart contract.
  </p>
  <p>
    <b>Contract address:</b> {{ proofStoreAddress }} <br>
    <b>Abi:</b> [{ "inputs": [ { "components": [ { "internalType": "string", "name": "t", "type": "string" }, { "internalType": "string", "name": "v", "type": "string" } ], "internalType": "struct Proof", "name": "proof", "type": "tuple" } ], "name": "addProof", "outputs": [], "stateMutability": "nonpayable", "type": "function" }] <br>
    <b>Method:</b> addProof <br>
    <b>Argument:</b> {t: "domain", v: "VALIDATED_DOMAIN"}
  </p>
  <p>
    For example if you have added Iden23 proof on wallet.mydomain.com then you have to call addProof({t: domain, v: wallet.mydomain.com})
  </p>
</template>