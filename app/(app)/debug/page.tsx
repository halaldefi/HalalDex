'use client'
import { Heading, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Heading size="md">Demos</Heading>
      <Link as={NextLink} href="/debug/token-approval" color="blue">
        Join with token approval
      </Link>
      <Link as={NextLink} href="/debug/relayer-approval" color="blue">
        Relayer approval
      </Link>
      <Link as={NextLink} href="/debug/token-select" color="blue">
        Token select
      </Link>
    </VStack>
  )
}
