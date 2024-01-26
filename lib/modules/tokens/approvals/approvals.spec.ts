import { SupportedChainId } from '@/lib/config/config.types'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import {
  TokenAmountToApprove,
  getRequiredTokenApprovals,
  isDoubleApprovalRequired,
} from './approval-rules'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { testRawAmount } from '@/test/utils/numbers'

const chainId: SupportedChainId = 1

const amountsToApprove: TokenAmountToApprove[] = [
  {
    tokenAddress: wETHAddress,
    rawAmount: testRawAmount('10'),
  },
  {
    tokenAddress: wjAuraAddress,
    rawAmount: testRawAmount('10'),
  },
]

const currentTokenAllowances = {
  [wETHAddress]: MAX_BIGINT,
  [wjAuraAddress]: MAX_BIGINT,
}

describe('getRequiredTokenApprovals', () => {
  test('when skipAllowanceCheck', () => {
    expect(
      getRequiredTokenApprovals({
        chainId,
        amountsToApprove,
        currentTokenAllowances,
        skipAllowanceCheck: true,
      })
    ).toEqual([])
  })

  test('when empty amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        chainId,
        amountsToApprove: [],
        currentTokenAllowances,
      })
    ).toEqual([])
  })

  test('when all token allowances are lesser than the amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        currentTokenAllowances,
      })
    ).toEqual([])
  })

  test('when some token allowances are greater than the amounts to approve', () => {
    currentTokenAllowances[wETHAddress] = 5n

    expect(
      getRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        currentTokenAllowances,
      })
    ).toEqual([
      {
        rawAmount: 10000000000000000000n,
        tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
    ])
  })
})

describe('isDoubleApprovalRequired', () => {
  test('when token is not special', () => {
    expect(isDoubleApprovalRequired(chainId, wETHAddress, currentTokenAllowances)).toBeFalsy()
  })
  test('when token is special (like USDT)', () => {
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    currentTokenAllowances[usdtAddress] = 10n
    expect(isDoubleApprovalRequired(chainId, usdtAddress, currentTokenAllowances)).toBeTruthy()
  })
  test('when token is special (like USDT) but current allowance is already zero', () => {
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    currentTokenAllowances[usdtAddress] = 0n
    expect(isDoubleApprovalRequired(chainId, usdtAddress, currentTokenAllowances)).toBeFalsy()
  })
})
