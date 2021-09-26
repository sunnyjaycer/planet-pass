import { FunctionComponent } from 'react'
import style from './ActionBar.module.scss'

const ActionBar: FunctionComponent = ({ children }) => {
  return <div className={`${style.actionBar}`}>{children}</div>
}

export default ActionBar
