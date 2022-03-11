<script setup lang="ts">
import CheckProofs from '../components/CheckProofs.vue';
import {useRoute} from 'vue-router'
const route = useRoute()
const contractAddress = route.params.contractAddress as string
</script>

<template>
  <CheckProofs :contract-address="contractAddress" />
</template>