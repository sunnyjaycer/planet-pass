import { FunctionComponent, createContext, useState } from 'react'

type transactionStatus = 'inactive' | 'inProgress' | 'complete' | 'error'

type transactionName = 'visitPlanet' | 'createPassport'

interface visitCompleteData {
  planetName: string
  stardustAmount: number
  videoSrc: string
  stampImgPath: string
  flagImgPath: string
  stamperImgPath: string
}

interface transactionData {
  id: string
}
interface TransactionState {
  status: transactionStatus
  type?: transactionName
  data?: visitCompleteData
}

interface TransactionContextInterface extends TransactionState {
  startTransaction: (
    transactionName: transactionName,
    transactionData: transactionData
  ) => void
  clearTransaction: () => void
}

export const TransactionContext = createContext<TransactionContextInterface>({
  status: 'inactive',
  startTransaction: (t: transactionName, d: transactionData) => {},
  clearTransaction: () => {}
})

export const TransactionContextProvider: FunctionComponent = ({ children }) => {
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'inactive'
  })

  const handleVisit = () => {
    console.log('TODO: handleVisit')
    setTimeout(() => {
      // Assume we get back some data about the results of the transaction
      // Also need to get users'
      // 1. stamp image
      // 2. flag image
      // 3. planet video

      const response = {
        stardustAmount: 25,
        planetName: 'Planet Name',
        videoSrc: '/GasGiant.mp4',
        stamperImgPath: '/visitComplete/stamper.png',
        stampImgPath: '/visitComplete/stamp.png',
        flagImgPath: '/visitComplete/flag.png'
      }
      setTransactionState({
        status: 'complete',
        type: 'visitPlanet',
        data: response
      })
    }, 3000)
  }

  const handleCreatePassport = () => {
    console.log('TODO: handleCreatePassport')
    setTimeout(() => {
      setTransactionState({ status: 'complete', type: 'createPassport' })
    }, 2000)
  }

  const startTransaction = (name: transactionName, data: transactionData) => {
    console.log('startTransaction')

    setTransactionState({ status: 'inProgress', type: 'createPassport' })

    if (name === 'visitPlanet') {
      handleVisit()
    } else if (name === 'createPassport') {
      handleCreatePassport()
    }
  }

  const clearTransaction = () => {
    setTransactionState({ status: 'inactive' })
  }

  return (
    <TransactionContext.Provider
      value={{ ...transactionState, startTransaction, clearTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
