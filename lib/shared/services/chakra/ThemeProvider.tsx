'use client'
import { ChakraProvider, ThemeTypings } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { theme as balTheme } from './themes/bal/bal.theme'
import { theme as cowTheme } from './themes/cow/cow.theme'
import { getProjectConfig } from '@/lib/config/getProjectConfig'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { variant } = useParams<{ variant?: string }>()
  const pathname = usePathname()
  const { projectName } = getProjectConfig()

  function getDefaultTheme() {
    switch (projectName) {
      // case 'BeethovenX':
      //   return beetsTheme
      case 'Balancer':
        return balTheme
      default:
        return balTheme
    }
  }

  const defaultTheme = getDefaultTheme()

  function getTheme(): ThemeTypings {
    const pathIncludesCow = pathname.split('/').includes('cow')
    if (pathIncludesCow || variant === 'cow') {
      return cowTheme
    }
    return defaultTheme
  }

  return (
    <ChakraProvider
      theme={getTheme()}
      cssVarsRoot="body"
      toastOptions={{ defaultOptions: { position: 'bottom-left' } }}
    >
      {children}
    </ChakraProvider>
  )
}
