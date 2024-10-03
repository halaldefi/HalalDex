import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

type Params = {
  params: {
    chain: string
  }
}

const ALCHEMY_KEY = process.env.NEXT_PRIVATE_ALCHEMY_KEY || ''
console.log('NEXT_PRIVATE_ALCHEMY_KEY', ALCHEMY_KEY)
const chainToRpcMap: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Arbitrum]: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Optimism]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Base]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Avalanche]: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Fantom]: `https://fantom-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Sepolia]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Fraxtal]: `https://frax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Gnosis]: `https://gnosis-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [GqlChain.Mode]: undefined,
  [GqlChain.Zkevm]: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
}
function getRpcUrl(chain: string) {
  try {
    const rpc = chainToRpcMap[chain as GqlChain]
    if (!rpc) throw new Error(`Invalid chain: ${chain}`)
    return rpc
  } catch (error) {
    console.error(`Error in getRpcUrl: ${error}`)
    throw new Error(`Invalid chain: ${chain}`)
  }
}

export async function POST(request: Request, { params: { chain } }: Params) {
  console.log(`Received POST request for chain: ${chain}`)

  if (!ALCHEMY_KEY) {
    console.error('NEXT_PRIVATE_ALCHEMY_KEY is missing')
    return new Response(JSON.stringify({ error: 'NEXT_PRIVATE_ALCHEMY_KEY is missing' }), {
      status: 500,
    })
  }

  try {
    const rpcUrl = getRpcUrl(chain)
    console.log(`RPC URL for ${chain}: ${rpcUrl}`)

    const rawBody = await request.text()
    console.log(`Raw request body: ${rawBody}`)

    let rpcBody
    try {
      rpcBody = JSON.parse(rawBody)
      console.log('Parsed RPC body:', rpcBody)
    } catch (parseError) {
      console.error(`Error parsing request body: ${parseError}`)
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
      })
    }

    console.log(`Sending request to RPC endpoint: ${rpcUrl}`)
    const rpcResponse = await fetch(rpcUrl, {
      method: 'POST',
      body: JSON.stringify(rpcBody),
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 0,
      },
    })

    console.log(`RPC response status: ${rpcResponse.status}`)
    const rpcResponseText = await rpcResponse.text()
    console.log(`RPC response body: ${rpcResponseText}`)

    let rpcResponseJson
    try {
      rpcResponseJson = JSON.parse(rpcResponseText)
    } catch (parseError) {
      console.error(`Error parsing RPC response: ${parseError}`)
      return new Response(JSON.stringify({ error: 'Invalid JSON in RPC response' }), {
        status: 502,
      })
    }

    return Response.json(rpcResponseJson)
  } catch (error) {
    console.error(`Error in POST handler: ${error}`)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
