import {InstagramProofValue, Proof} from '../models/proof'
import dnsQuery from './dns-query'
import instagram, {Instagram} from './instagram'

class ProofManager {
  constructor(private instagram: Instagram) {}

  public createDomainProofString(walletAddress: string): string {
    return `iden23-proof='w:${walletAddress.toLowerCase()}'`
  }

  public createInstagramProofString(walletAddress: string): string {
    return `iden23-proof='w:${walletAddress.toLowerCase()}'`
  }

  public async validateProof(proof: Proof, walletAddress: string): Promise<boolean> {
    if (proof.type === 'domain') {
      const proofRecords = await dnsQuery.getWalletProofs(proof.value)
      const walletProof = this.createDomainProofString(walletAddress)
      return proofRecords.some(p => p === walletProof)
    } else {
      const parsedProofValue = JSON.parse(proof.value) as InstagramProofValue
      const post = await this.instagram.getPostData(parsedProofValue.postUrl)
      return post.title.toLowerCase().includes(this.createInstagramProofString(walletAddress)) && post.authorName === parsedProofValue.profile
    }
  }
}
export default new ProofManager(instagram)
