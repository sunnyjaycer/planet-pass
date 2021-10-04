import { FunctionComponent, useCallback } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

export const Web3ContextProvider: FunctionComponent = ({ children }) => {
  const getLibrary = useCallback((provider: any) => {
    const lib = new Web3Provider(provider)
    lib.pollingInterval = 12000
    return lib
  }, [])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}
