import { Card, CardBody, HStack, Text } from '@chakra-ui/react'

import { usePoolStats } from './usePoolStats'

export function PoolStatCards() {
  const { stats } = usePoolStats()

  return (
    <HStack maxWidth="900px">
      {stats.map(stat => {
        return (
          <Card flex="1" key={stat.title}>
            <CardBody>
              <Text>{stat.title}</Text>
              <Text fontWeight="bold">{stat.value}</Text>
            </CardBody>
          </Card>
        )
      })}
    </HStack>
  )
}