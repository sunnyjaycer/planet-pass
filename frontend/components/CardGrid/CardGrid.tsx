import { FunctionComponent, useState } from 'react'
import style from './CardGrid.module.scss'

type CardGridProps = {
  largeCards?: boolean
  header?: string
  description?: string
  linkText?: string
  link?: string
  noPad?: boolean
  collapsible?: boolean
}

const CardGrid: FunctionComponent<CardGridProps> = ({
  header,
  largeCards,
  noPad,
  description,
  collapsible,
  children
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const el = (
    <div
      className={`${style.cardGrid} ${largeCards ? style.largeCards : ''} ${
        noPad ? style.noPad : ''
      } ${collapsible ? style.collapsible : ''}  ${
        !isOpen ? style.closed : ''
      }`}
    >
      {header && collapsible ? (
        <h2 className={style.header}>
          <button
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            className={style.button}
          >
            {header}
          </button>
        </h2>
      ) : (
        <h2 className={style.header}>{header}</h2>
      )}
      {isOpen && (
        <div>
          {description && <p className={style.description}>{description}</p>}

          <div
            className={`${style.cardGridCards} ${
              largeCards ? style.largeCards : ''
            }`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  )
  return collapsible ? <div className={style.pad}>{el}</div> : el
}

export default CardGrid
