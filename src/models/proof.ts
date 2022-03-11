export declare type ProofType = 'domain' | 'instagram'

export type InstagramProofValue = {
  profile: string
  postUrl: string
}

export type Proof = {
  type: ProofType
  value: string
}