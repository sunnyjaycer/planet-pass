import { FunctionComponent, useContext, useState } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import style from './CreatePassport.module.scss'
import { CloseIcon } from '../Icons'
import Select from '../Select'
import Button from '../Button'
import Modal from 'react-modal'
import LazyMedia from '../LazyMedia'

type CreatePassportModalProps = {
  handleClose: () => void
  isOpen: boolean
}

const defaultPassport = 'Basic Green'

const CreatePassportModal: FunctionComponent<CreatePassportModalProps> = ({
  handleClose,
  isOpen
}) => {
  const [currentPassport, setCurrentPassport] = useState(defaultPassport)

  const closeAndReset = () => {
    handleClose()
    setCurrentPassport(defaultPassport)
  }
  // const transactionContext = useContext(TransactionContext)
  const handleCreateClick = () => {
    // transactionContext.startTransaction('visitPlanet', {
    //   id: 'foo'
    // })
    alert('TODO handle create passport transaction')
    closeAndReset()
  }

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Planet Details"
      onRequestClose={closeAndReset}
      className={style.modal}
      overlayClassName={style.overlay}
      shouldCloseOnOverlayClick={true}
    >
      <div className={style.modalContent}>
        <button
          className={style.closeButton}
          onClick={closeAndReset}
          aria-label="Close Planet Details"
        >
          <CloseIcon />
        </button>
        <div className={style.content}>
          <div className={style.planetMedia}>
            <div className={style.mediaContainer}>
              <LazyMedia
                videoSrc={
                  currentPassport === 'Basic Green'
                    ? '/passports/passport-green.mp4'
                    : '/passports/passport-pink.mp4'
                }
                altText="passport"
                noBk
                cover
              />
            </div>
          </div>
          <div className={style.mainText}>
            <h1 className={style.heading}>Create a New Passport</h1>

            <div className={style.formWrap}>
              <h2 className={style.subhead}>Passport Info</h2>

              <div className={style.selectWrap}>
                <Select
                  label="Passport Style"
                  options={['Basic Green', 'Basic Pink']}
                  handleSelect={(s) => {
                    setCurrentPassport(s)
                  }}
                  id="PassportStyle"
                />
              </div>
              <div className={style.textInputWrap}>
                <label className={style.label} htmlFor="newPassportName">
                  Passport Name
                </label>
                <input
                  id="newPassportName"
                  type="text"
                  placeholder="Passport Name"
                  className={style.filterInput}
                />
              </div>
              <div className={style.formBottom}>
                <Button
                  text="Create Passport"
                  buttonStyle="secondary"
                  handleClick={handleCreateClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CreatePassportModal
