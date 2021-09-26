import { FunctionComponent } from 'react'
import style from './CardGrid.module.scss'

type CardGridProps = {
  largeCards?: boolean
  header?: string
  linkText?: string
  link?: string
  noPad?: boolean
}

const CardGrid: FunctionComponent<CardGridProps> = ({
  header,
  largeCards,
  noPad,
  children
}) => {
  return (
    <div
      className={`${style.cardGrid} ${largeCards ? style.largeCards : ''} ${
        noPad ? style.noPad : ''
      }`}
    >
      {header && <h2 className={style.header}>{header}</h2>}
      <div
        className={`${style.cardGridCards} ${
          largeCards ? style.largeCards : ''
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default CardGrid
