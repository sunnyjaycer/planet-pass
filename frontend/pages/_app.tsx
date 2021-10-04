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

import { Web3ContextProvider } from '../context/Web3Context'
import TransactionLayer from '../components/TransactionLayer'
import { TransactionContextProvider } from '../context/TransactionContext'

import Modal from 'react-modal'

// Sets modal to document root
Modal.setAppElement('#root')

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div id="root">
      <Web3ContextProvider>
        <TransactionContextProvider>
          <Component {...pageProps} />
          <TransactionLayer />
        </TransactionContextProvider>
      </Web3ContextProvider>
    </div>
  )
}
export default MyApp
