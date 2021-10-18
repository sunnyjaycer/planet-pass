import { FunctionComponent, useState, useContext } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import style from './DetailsModal.module.scss'
import { CloseIcon } from '../Icons'
import Select from '../Select'
import Button from '../Button'
import Modal from 'react-modal'
import LazyMedia from '../LazyMedia'
import Image from 'next/image'
import { Attribute } from '../../types'
import stampGreen from '../../assets/stamps/stamp-basic-green.png'
import stampPink from '../../assets/stamps/stamp-basic-pink.png'

type DetailsModalProps = {
  name: string
  attributes: Attribute[]
  price: number
  priceUnit?: string
  videoSrc?: string
  handleClose?: () => void
  isOpen: boolean
}

const DetailsModal: FunctionComponent<DetailsModalProps> = ({
  name,
  attributes,
  price,
  priceUnit = 'WETH',
  videoSrc,
  handleClose,
  isOpen
}) => {
  const [activeStamp, setActiveStamp] = useState('Basic Green')
  const [currentPrice, setCurrentPrice] = useState('0.15')
  const [currentName, setCurrentName] = useState(name)

  const transactionContext = useContext(TransactionContext)

  const handleVisitClick = () => {
    transactionContext.startTransaction('visitPlanet', {
      id: 'foo'
    })
    handleClose && handleClose()
  }

  const handlePlanetUpdate = () => {
    alert('TODO: Handle Update Planet')
  }
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Planet Details"
      onRequestClose={() => {
        handleClose && handleClose()
      }}
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
          <div>
            <div className={style.leftBar}>
              <div className={style.videoContainer}>
                <LazyMedia videoSrc={videoSrc} videoControls />
              </div>
              <div className={style.planetHeader}>
                <h1 className={style.planetName}>{name}</h1>

                <Button
                  text="View on OpenSea"
                  buttonStyle="tertiary"
                  linkUrl="https://opensea.io/collection/the-wanderers"
                />
              </div>
            </div>
          </div>
          <div className={style.planetText}>
            <div className={style.formWrap}>
              <h2 className={style.subhead}>Owner Information</h2>
              <div className={style.ownerInputs}>
                <div className={style.textInputWrap}>
                  <label className={style.label} htmlFor="VisitPrice">
                    Visit Price (WETH)
                  </label>
                  <input
                    id="VisitPrice"
                    type="text"
                    value={currentPrice}
                    className={style.textInput}
                    onChange={(e) => {
                      setCurrentPrice(e.target.value)
                    }}
                  />
                </div>
                <div className={style.textInputWrap}>
                  <label className={style.label} htmlFor="SetPlanetName">
                    Planet Name
                  </label>
                  <input
                    id="SetPlanetName"
                    type="text"
                    className={style.textInput}
                    value={currentName}
                    onChange={(e) => {
                      setCurrentName(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className={style.formBottom}>
                <div />
                <Button
                  text="Update Planet"
                  buttonStyle="secondary"
                  handleClick={handlePlanetUpdate}
                />
              </div>
            </div>

            <div className={style.formWrap}>
              <h2 className={style.subhead}>Visitor Information</h2>

              <div className={style.visitInputs}>
                <div className={style.activeStamp}>
                  <Image
                    src={activeStamp === 'Basic Green' ? stampGreen : stampPink}
                    alt="greenStamp"
                    layout="fixed"
                    width={100}
                    height={100}
                  />
                </div>
                <div className={style.selectStamp}>
                  <Select
                    label="Choose Stamp"
                    id="ChooseStamp"
                    handleSelect={(val) => {
                      setActiveStamp(val)
                    }}
                    defaultValue={activeStamp}
                    options={['Basic Green', 'Basic Pink']}
                  />
                </div>

                <Select
                  label="Choose Passport"
                  id="ChoosePassport"
                  options={['BigBigOceans', 'JustWanderin', 'The Pyramids']}
                />
              </div>

              <div className={style.formBottom}>
                <div className={style.priceInfo}>
                  Visit Price{' '}
                  <strong>
                    <span className={style.price}>{price}</span> {priceUnit}
                  </strong>
                </div>
                <Button
                  text="visit"
                  buttonStyle="secondary"
                  handleClick={handleVisitClick}
                />
              </div>
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
