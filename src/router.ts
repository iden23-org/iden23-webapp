import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from './views/Home.vue'
import ManualProofSubmit from './views/ManualProofSubmit.vue'
import Prove from './views/Prove.vue'
import CheckProofs from './views/CheckProofs.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/manual-proof-submit',
    name: 'manual_proof_submit',
    component: ManualProofSubmit,
  },
  {
    path: '/prove',
    name: 'prove',
    component: Prove,
  },
  {
    path: '/check/:contractAddress',
    component: CheckProofs,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});