/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { useCurrency } from '../../hooks/useCurrency'
import { bn, fNum } from '../../utils/numbers'

export function TransactionDetailsAccordion() {
  const { toCurrency } = useCurrency()

  return (
    <Accordion w="full" variant="button" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" color="font.primary" flex="1" textAlign="left">
            Transaction Details
          </Box>
          <AccordionIcon textColor="font.highlight" />
        </AccordionButton>
        <AccordionPanel pb="md">
          <VStack w="full" textColor="grayText">
            <HStack w="full" justifyContent="space-between">
              <div>Total added</div>
              {/* <HStack w="full" justifyContent="space-between">
              <div>Final slippage</div>
              <div>TODO</div>
            </HStack> */}
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
