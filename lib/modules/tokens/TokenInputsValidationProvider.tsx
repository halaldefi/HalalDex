'use client'

import { GqlToken } from '@/lib/modules/tokens/SupportedChains'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext, useState } from 'react'
import { Address } from 'viem'

export function _useTokenInputsValidation() {
  type ValidationErrorsByToken = Record<Address, string>
  const [validationErrors, setValidationErrors] = useState<ValidationErrorsByToken>({})

  function setValidationError(tokenAddress: Address, value: string) {
    // console.log(`Setting validation error for token ${tokenAddress}: ${value}`)
    validationErrors[tokenAddress] = value
    setValidationErrors({ ...validationErrors })
    // console.log('Updated validation errors:', validationErrors)
  }

  function hasValidationError(token: GqlToken | undefined) {
    const result = !!getValidationError(token)
    // console.log(`Checking validation error for token ${token?.address}: ${result}`)
    return result
  }

  function getValidationError(token: GqlToken | undefined): string {
    if (!token) {
      // console.log('getValidationError: Token is undefined')
      return ''
    }
    const error = validationErrors[token.address as Address]
    // console.log(`Getting validation error for token ${token.address}: ${error || 'No error'}`)
    if (!error) return ''
    return error
  }

  // console.log('Current validationErrors:', validationErrors)
  const hasValidationErrors = Object.values(validationErrors).some(
    error => error !== '' && error !== undefined
  )
  // console.log('Calculated hasValidationErrors:', hasValidationErrors)

  return {
    setValidationError,
    getValidationError,
    hasValidationError,
    hasValidationErrors,
    validationErrors, // Add this line to expose validationErrors
  }
}

export type Result = ReturnType<typeof _useTokenInputsValidation>
export const TokenValidationContext = createContext<Result | null>(null)

export function TokenInputsValidationProvider({ children }: PropsWithChildren) {
  const validation = _useTokenInputsValidation()

  return (
    <TokenValidationContext.Provider value={validation}>{children}</TokenValidationContext.Provider>
  )
}

export const useTokenInputsValidation = (): Result =>
  useMandatoryContext(TokenValidationContext, 'TokenInputsValidation')
