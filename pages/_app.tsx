// core styles for static tweet renderer (optional)
import 'react-static-tweets/styles.css'

// global styles shared across the entire site
import 'styles/global.css'

import React from 'react'
import { useRouter } from 'next/router'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import * as Fathom from 'fathom-client'

import { bootstrap } from 'lib/bootstrap-client'
import { fathomId, fathomConfig } from 'lib/config'

if (typeof window !== 'undefined') {
  bootstrap()
}

// delete theme.styles.global

const theme = extendTheme({
  colors: {
    blue: {
      500: '#00BCFF'
    }
  },
  styles: {
    global: {
      body: {
        color: 'var(--text-color)',
        bg: 'var(--body-bg-color)'
      },
      'h1,h2,h3,h4,h5,h6': {
        fontWeight: '700',
        color: 'var(--text-h-color)'
      },
      h1: {
        fontSize: '36px'
      },
      h2: {
        fontSize: '24px'
      }
    }
  },
  fonts: {
    body: `'Nunito', -apple-system, BlinkMacSystemFont, sans-serif`,
    heading: `'Nunito', -apple-system, BlinkMacSystemFont, sans-serif`
  },
  light: {
    bg: 'var(--body-bg-color)'
  }
})

export default function App({ Component, pageProps }) {
  const router = useRouter()

  React.useEffect(() => {
    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)

      function onRouteChangeComplete() {
        Fathom.trackPageview()
      }

      router.events.on('routeChangeComplete', onRouteChangeComplete)

      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [router.events])

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
