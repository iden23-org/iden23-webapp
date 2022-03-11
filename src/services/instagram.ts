import appEnv from '../app-env'

export type InstagramPost = {
  title: string
  authorName: string
}

export class Instagram {
  private readonly apiOrigin: string
  constructor() {
    this.apiOrigin = appEnv.apiOrigin
  }

  public async getPostData(postUrl: string): Promise<InstagramPost> {
    const response = await fetch(`${this.apiOrigin}/instagram/post?url=${postUrl}`)
    return (await response.json())
  }
}
export default new Instagram()
