import { FunctionComponent } from 'react'
import style from './CardGrid.module.scss'

const CardGrid: FunctionComponent = ({ children }) => {
  return <div className={style.cardGrid}>{children}</div>
}

export default CardGrid
