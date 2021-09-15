import 'minireset.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

import '@fontsource/roboto-mono/300.css'
import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/700.css'

import '../styles/globals.scss'

import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

function MyApp({ Component, pageProps }: AppProps) {
  // Get the ethersjs library
  const getLibrary = (provider: any) => {
    const lib = new Web3Provider(provider)
    lib.pollingInterval = 12000
    return lib
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  )
}
export default MyApp
