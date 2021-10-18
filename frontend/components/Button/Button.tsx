import { FunctionComponent } from 'react'
import style from './Button.module.scss'

type ButtonProps = {
  text: string
  handleClick?: () => void
  icon?: 'add'
  buttonStyle?: 'primary' | 'secondary' | 'tertiary'
  linkUrl?: string
}

const Button: FunctionComponent<ButtonProps> = ({
  text,
  handleClick,
  icon,
  buttonStyle,
  linkUrl
}) => {
  const className = `${style.button} ${
    icon ? `${style.icon} ${style['icon-' + icon]}` : ''
  } ${
    buttonStyle && buttonStyle === 'secondary'
      ? style.buttonSecondary
      : buttonStyle === 'tertiary'
      ? style.buttonTertiary
      : style.buttonPrimary
  }`

  const onClick = () => {
    if (handleClick) {
      handleClick()
    }
  }
  return typeof linkUrl !== 'undefined' ? (
    <a
      className={className}
      onClick={onClick}
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  ) : (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
