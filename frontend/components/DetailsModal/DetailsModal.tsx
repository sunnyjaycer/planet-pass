import { FunctionComponent } from 'react'
import style from './DetailsModal.module.scss'
import { CloseIcon } from '../Icons'
import Image from 'next/image'
import Modal from 'react-modal'

type Attribute = {
  attribute: string
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
              />
            </div>
          </div>
          <div className={style.planetText}>
            <h1 className={style.planetName}>{name}</h1>
            <ul className={style.planetAttributes}>
              {attributes.map(({ attribute, value }) => (
                <li
                  className={style.attribute}
                  key={`${name}-attribute-${attribute}`}
                >
                  <div className={style.attributeName}>{attribute}</div>
                  <div className={style.attributeValue}>{value}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={style.planetSub}>
          <div className={style.planetPrice}>
            Visit Price {price} {priceUnit} <br />
            TODO! -&gt; Buy/Visit Buttons
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DetailsModal
