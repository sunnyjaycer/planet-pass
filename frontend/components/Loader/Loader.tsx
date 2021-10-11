import { FunctionComponent } from 'react'
import style from './Loader.module.scss'

const Loader: FunctionComponent = ({ children }) => {
  return (
    <div className={style.loader}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loader
