import { FunctionComponent, useRef } from 'react'
import style from './DetailsModal.module.scss'
import { CloseIcon } from '../Icons'
import SelectPassport from '../SelectPassport'
import Button from '../Button'
import Modal from 'react-modal'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { visitLottieData } from '../../assets/lottie-visit/visitLottieData'

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
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const testStamp = () => {
    if (lottieRef.current && lottieRef.current?.play) {
      lottieRef.current.play()
    }
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
              <div className={style.lottieContainer}>
                <Lottie
                  animationData={visitLottieData}
                  loop={false}
                  autoplay={false}
                  lottieRef={lottieRef}
                />
                ;
              </div>
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

            <div className={style.travelerInfo}>
              Visit Price{' '}
              <strong>
                {price} {priceUnit}
              </strong>
              <span className={style.priceSpacer}>/</span>
              <a href="https://opensea.io/collection/the-wanderers">
                View on OPENSEA
              </a>
            </div>
            <div className={style.visitTransactionWrap}>
              <div>
                <SelectPassport
                  options={['Passport 1', 'Passport 2', 'Passport 3']}
                />
              </div>
              <Button
                text="visit"
                buttonStyle="secondary"
                handleClick={testStamp}
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
