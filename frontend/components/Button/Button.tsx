import { FunctionComponent } from 'react'
import style from './Button.module.scss'

type ButtonProps = {
  text: string
  handleClick?: () => void
  icon?: 'add'
}

const Button: FunctionComponent<ButtonProps> = ({
  text,
  handleClick,
  icon
}) => {
  return (
    <button
      className={`${style.button} ${
        icon ? `${style.icon} ${style['icon-' + icon]}` : ''
      }`}
      onClick={() => {
        if (handleClick) {
          handleClick()
        }
      }}
    >
      {text}
    </button>
  )
}

export default Button
