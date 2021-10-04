import { FunctionComponent, useContext } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import Modal from 'react-modal'
import style from './TransactionLayer.module.scss'
import VisitComplete from '../VisitComplete'

type TransactionLayerProps = {}

const TransactionLayer: FunctionComponent<TransactionLayerProps> = () => {
  const { status, type, data, clearTransaction } =
    useContext(TransactionContext)

  return (
    <Modal
      isOpen={status !== 'inactive'}
      contentLabel="Transaction"
      className={style.modal}
      overlayClassName={style.overlay}
      shouldCloseOnOverlayClick={true}
    >
      {status === 'inProgress' ? (
        <div className={style.logModal}>
          <div className={style.logContent}>
            Please complete your visit using MetaMask.
          </div>
        </div>
      ) : status === 'complete' && type === 'visitPlanet' && data ? (
        <div className={style.completeModal}>
          <div className={style.visitCompleteContent}>
            <VisitComplete
              planetName={data?.planetName}
              stardustAmount={data?.stardustAmount}
              videoSrc={data?.videoSrc}
              stamperImgPath={data?.stamperImgPath}
              stampImgPath={data?.stampImgPath}
              flagImgPath={data?.flagImgPath}
              onComplete={clearTransaction}
            />
          </div>
        </div>
      ) : (
        <div className={style.logModal}>
          <div className={style.logContent}>{`Status: ${status}`}</div>
        </div>
      )}
    </Modal>
  )
}

export default TransactionLayer
