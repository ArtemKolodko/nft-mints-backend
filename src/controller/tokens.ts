import dataObj from 'src/store/mock'

export async function fetchTokenByAddress(tokenAddress: string) {
  return dataObj.nfts.find((nft) => nft.nftAddress === tokenAddress)
}

export async function fetchTokens() {
  console.log(dataObj)
  return dataObj
}
