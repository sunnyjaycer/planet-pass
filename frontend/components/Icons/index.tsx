import { FunctionComponent } from 'react'

type Icon = {
  color?: string
}

export const CloseIcon: FunctionComponent<Icon> = ({ color = '#00FAB3' }) => (
  <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
    <circle cx="30.4056" cy="30.4053" r="20.5" stroke={color} strokeWidth="2" />
    <path d="M21.1149 21.1143L39.6961 39.6955" stroke={color} strokeWidth="2" />
    <path d="M39.696 21.1143L21.1148 39.6955" stroke={color} strokeWidth="2" />
  </svg>
)
