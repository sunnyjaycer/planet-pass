import { FunctionComponent, useRef, useContext } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import style from './DetailsModal.module.scss'
import { CloseIcon } from '../Icons'
import SelectPassport from '../SelectPassport'
import Button from '../Button'
import Modal from 'react-modal'

import Lottie, { LottieRefCurrentProps } from 'lottie-react'

type Attribute = {
  trait_type: string
  value: string | number
}

type DetailsModal = {
  name: string
  attributes: Attribute[]
  price: number
  priceUnit?: string
  videoSrc?: string
  handleClose?: () => void
  isOpen: boolean
}

const DetailsModal: FunctionComponent<DetailsModal> = ({
  name,
  attributes,
  price,
  priceUnit = 'WETH',
  videoSrc,
  handleClose,
  isOpen
}) => {
  const transactionContext = useContext(TransactionContext)

  const handleVisitClick = () => {
    transactionContext.startTransaction('visitPlanet', {
      id: 'foo'
    })
    handleClose && handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Planet Details"
      onRequestClose={handleClose}
      className={style.modal}
      overlayClassName={style.overlay}
      shouldCloseOnOverlayClick={true}
    >
      <div className={style.modalContent}>
        <button
          className={style.closeButton}
          onClick={handleClose}
          aria-label="Close Planet Details"
        >
          <CloseIcon />
        </button>
        <div className={style.planetInfo}>
          <div className={style.planetMedia}>
            <div className={style.videoContainer}>
              <video
                className={style.video}
                src={videoSrc}
                autoPlay
                muted
                loop
                controls
              />
            </div>
          </div>
          <div className={style.planetText}>
            <h1 className={style.planetName}>{name}</h1>

            <div className={style.travelerInfo}>
              Visit Price{' '}
              <strong>
                {price} {priceUnit}
              </strong>
              <span className={style.priceSpacer}>/</span>
              <a href="https://opensea.io/collection/the-wanderers">
                View on OPENSEA{' '}
              </a>
            </div>

            <div className={style.visitTransactionWrap}>
              <strong style={{ fontSize: 14 }}>
                TODO: if owned, manage visit price
              </strong>
            </div>

            <div className={style.visitTransactionWrap}>
              <div>
                <SelectPassport
                  options={['BigBigOceans', 'JustWanderin', 'The Pyramids']}
                />
              </div>
              <Button
                text="visit"
                buttonStyle="secondary"
                handleClick={handleVisitClick}
              />
            </div>

            <h2 className={style.attributesHeader}>Attributes</h2>

            <ul className={style.planetAttributes}>
              {attributes.map(({ trait_type, value }) => (
                <li
                  className={style.attribute}
                  key={`${name}-attribute-${trait_type}`}
                >
                  <div className={style.attributeName}>{trait_type}</div>
                  <div className={style.attributeValue}>{value}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DetailsModal
