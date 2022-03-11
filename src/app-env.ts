import {Chain} from './services/wallet'

export default {
  chain: import.meta.env.VITE_CHAIN as Chain,
  proofStoreAddress: import.meta.env.VITE_PROOF_STORE_ADDRESS as string,
  etherScanSubdomain: import.meta.env.ETHER_SCAN_SUBDOMAIN as string,
  apiOrigin: import.meta.env.VITE_API_ORIGIN as string,
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
}