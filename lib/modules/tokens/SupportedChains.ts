import { Scalars, GqlPriceRateProviderData } from '@/lib/shared/services/api/generated/graphql'
import { Maybe } from 'graphql/jsutils/Maybe'

export enum GqlChain {
  Arbitrum = 'ARBITRUM',
  Base = 'BASE',
  Mainnet = 'MAINNET',
  Polygon = 'POLYGON',
  Sepolia = 'SEPOLIA',
  BSC = 'BSC',
}

export type GqlToken = {
  __typename: 'GqlToken'
  /** The address of the token */
  address: Scalars['String']['output']
  /** The chain of the token */
  chain: GqlChain
  /** The chain ID of the token */
  chainId: Scalars['Int']['output']
  /** The coingecko ID for this token, if present */
  coingeckoId?: Maybe<Scalars['String']['output']>
  /** The number of decimal places for the token */
  decimals: Scalars['Int']['output']
  /** The description of the token */
  description?: Maybe<Scalars['String']['output']>
  /** The Discord URL of the token */
  discordUrl?: Maybe<Scalars['String']['output']>
  /** Whether the token is considered an ERC4626 token. */
  isErc4626: Scalars['Boolean']['output']
  /** The logo URI of the token */
  logoURI?: Maybe<Scalars['String']['output']>
  /** The name of the token */
  name: Scalars['String']['output']
  /** The rate provider data for the token */
  priceRateProviderData?: Maybe<GqlPriceRateProviderData>
  /** The priority of the token, can be used for sorting. */
  priority: Scalars['Int']['output']
  /** The rate provider data for the token */
  rateProviderData?: Maybe<GqlPriceRateProviderData>
  /** The symbol of the token */
  symbol: Scalars['String']['output']
  /** The Telegram URL of the token */
  telegramUrl?: Maybe<Scalars['String']['output']>
  /** Indicates if the token is tradable */
  tradable: Scalars['Boolean']['output']
  /** The Twitter username of the token */
  twitterUsername?: Maybe<Scalars['String']['output']>
  /** The website URL of the token */
  websiteUrl?: Maybe<Scalars['String']['output']>
}
