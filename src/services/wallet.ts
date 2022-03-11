import {ethers} from 'ethers'
import {ExternalProvider} from '@ethersproject/providers/src.ts/web3-provider'
import proofStoreContract from './contracts/proof-store'
import {Proof, ProofType} from '../models/proof'
import appEnv from '../app-env'

declare const window: {ethereum: ExternalProvider}

export class EthersApiRateLimit extends Error {}

const chainIds: Record<Chain, number> = {
  rinkeby: 4,
  mainnet: 1,
}

export declare type Chain = 'rinkeby' | 'mainnet'

class Wallet {
  private readonly alchemyProvider
  private readonly metamaskProvider
  public readonly proofStoreAddress: string
  private readonly etherApiBaseUrl: string

  constructor() {
    this.alchemyProvider = new ethers.providers.AlchemyProvider(chainIds[appEnv.chain], appEnv.alchemyApiKey)
    this.metamaskProvider = new ethers.providers.Web3Provider(window.ethereum)
    this.proofStoreAddress = appEnv.proofStoreAddress
    this.etherApiBaseUrl = `https://${appEnv.etherScanSubdomain}.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&address=`
  }

  public async requestChain(chain: Chain) {
    if (!window.ethereum?.request) {
      alert('Metamask wallet not found')
      return
    }
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexValue(chainIds[chain]) }], // chainId must be in hexadecimal numbers
    });
  }

  public async getMetamaskSigner() {
    await this.metamaskProvider.send('eth_requestAccounts', [])
    return this.metamaskProvider.getSigner()
  }

  public async getAccountAddress() {
    const signer = await this.getMetamaskSigner()
    return await signer.getAddress()
  }

  private async getProofStoreContract() {
    return new ethers.Contract(this.proofStoreAddress, proofStoreContract.abi, await this.alchemyProvider)
  }

  public getProofObject(proofType: ProofType, proofValue: string) {
    return {t: proofType, v: proofValue}
  }

  public async addProof(proofType: ProofType, proofValue: string): Promise<void> {
    const contract = await this.getProofStoreContract()
    const tx = await contract.addProof(this.getProofObject(proofType, proofValue))
    await tx.wait()
  }

  public async getContractCreatorAddress(contractAddress: string): Promise<string> {
    const response = await fetch(this.etherApiBaseUrl+contractAddress)
    const json = await response.json()

    if (json.result.includes('Max rate limit reached')) {
      throw new EthersApiRateLimit()
    }

    return json.result.length ? json.result[0].from : ''
  }

  public async getProofs(walletAddress: string): Promise<Proof[]> {
    const contract = await this.getProofStoreContract()
    const proofs = await contract.getProofsOfWallet(walletAddress)
    return proofs.map((p: {t: string, v: string}) => ({
      type: p.t,
      value: p.v,
    }))
  }
}

export default new Wallet()