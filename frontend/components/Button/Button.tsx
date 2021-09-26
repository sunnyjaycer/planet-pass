import { FunctionComponent } from 'react'
import style from './Button.module.scss'

type ButtonProps = {
  text: string
  handleClick?: () => void
  icon?: 'add'
  buttonStyle?: 'primary' | 'secondary'
}

const Button: FunctionComponent<ButtonProps> = ({
  text,
  handleClick,
  icon,
  buttonStyle
}) => {
  return (
    <button
      className={`${style.button} ${
        icon ? `${style.icon} ${style['icon-' + icon]}` : ''
      } ${
        buttonStyle && buttonStyle === 'secondary'
          ? style.buttonSecondary
          : style.buttonPrimary
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
