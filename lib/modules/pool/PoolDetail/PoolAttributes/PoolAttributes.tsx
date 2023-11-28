import { Box, Card, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import useFormattedPoolAttributes from './useFormattedPoolAttributes'
import { upperFirst } from 'lodash'

const CAPITALISED_FIELDS = ['Pool type']

export function PoolAttributes() {
  const formattedAttributes = useFormattedPoolAttributes()

  return (
    <Card width="full" variant="level3" px="6" py="5" minHeight="400px">
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool attributes
        </Heading>
        <VStack width="full">
          <HStack spacing="8" width="full">
            <Box minWidth="150px">
              <Heading variant="h6" fontSize="1rem">
                Attribute
              </Heading>
            </Box>
            <Heading variant="h6" fontSize="1rem">
              Details
            </Heading>
          </HStack>
          {formattedAttributes.map(attribute => {
            let formattedValue = attribute?.value
            if (CAPITALISED_FIELDS.includes(attribute?.title || '')) {
              formattedValue = upperFirst(attribute?.value.toLowerCase())
            }

            return (
              attribute && (
                <HStack width="full" spacing="8" key={`pool-attribute-${attribute.title}`}>
                  <Box minWidth="150px">
                    <Text variant="secondary">{attribute.title}</Text>
                  </Box>
                  <Text variant="secondary">{formattedValue}</Text>
                </HStack>
              )
            )
          })}
        </VStack>
      </VStack>
    </Card>
  )
}
