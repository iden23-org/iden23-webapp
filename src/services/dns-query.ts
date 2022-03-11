class DnsQuery {
  public async getWalletProofs(domain: string): Promise<string[]> {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`, {
      headers: {
        'Accept': 'application/dns-json'
      }
    })
    const j = await response.json() as {Answer: {data: string}[]}
    if (!j.Answer) {
      return []
    }
    return j.Answer.map(a => {
      try {
        const proof = JSON.parse(a.data)
        if (proof.split('=')[0] !== 'iden23-proof') return ''

        return proof.trim()
      } catch (e) {
        return ''
      }

    }).filter(v => v !== '')
  }
}

export default new DnsQuery()
