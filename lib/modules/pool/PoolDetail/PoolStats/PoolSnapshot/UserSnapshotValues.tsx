'use client'

import { Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import { useClaim } from '../../../actions/claim/ClaimProvider'
import { usePool } from '../../../PoolProvider'
import { ClaimModal } from '../../../actions/claim/ClaimModal'

export type PoolMyStatsValues = {
  myLiquidity: number
  myPotentialWeeklyYield: string
  myClaimableRewards: number
}

export function UserSnapshotValues() {
  const { pool } = usePool()

  const { previewModalDisclosure } = useClaim()

  function onModalClose() {
    previewModalDisclosure.onClose()
  }
  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My liquidity
        </Text>

        <Skeleton height="28px" w="100px" />
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My APR
        </Text>
        <Heading size="h4">&mdash;</Heading>
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs"></Text>
        <Skeleton height="28px" w="100px" />
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My claimable rewards
        </Text>
        :
        <Skeleton height="28px" w="100px" />
      </VStack>
      <ClaimModal
        isOpen={previewModalDisclosure.isOpen}
        onClose={onModalClose}
        chain={pool.chain}
      />
    </>
  )
}
