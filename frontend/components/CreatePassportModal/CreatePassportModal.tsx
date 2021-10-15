import { FunctionComponent, useContext, useState } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import style from './CreatePassport.module.scss'
import { CloseIcon } from '../Icons'
import SelectPassport from '../SelectPassport'
import Button from '../Button'
import Modal from 'react-modal'
import LazyMedia from '../LazyMedia'
import fpoPassport from '../../assets/fpoPassport.png'
import fpoPassportPink from '../../assets/fpoPassportPink.png'

type CreatePassportModalProps = {
  handleClose: () => void
  isOpen: boolean
}

const defaultPassport = 'Basic Black'

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
                imgSrc={
                  currentPassport === 'Basic Black'
                    ? fpoPassport
                    : fpoPassportPink
                }
                altText="passport"
                aspect={248 / 351}
                noBk
              />
            </div>
          </div>
          <div className={style.mainText}>
            <h1 className={style.heading}>Create a New Passport</h1>

            <div className={style.formWrap}>
              <h2 className={style.subhead}>Passport Info</h2>

              <div className={style.selectWrap}>
                <SelectPassport
                  label="Passport Style"
                  options={['Basic Black', 'Basic Pink']}
                  handleSelect={(s) => {
                    setCurrentPassport(s)
                  }}
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
