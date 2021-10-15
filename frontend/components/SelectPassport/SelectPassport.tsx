import { FunctionComponent } from 'react'
import style from './SelectPassport.module.scss'

type SelectPassportProps = {
  options: string[]
  label?: string
  handleSelect?: (s: string) => void
}

const SelectPassport: FunctionComponent<SelectPassportProps> = ({
  label = 'Choose Passport',
  options,
  handleSelect
}) => {
  return (
    <div className={style.selectWrap}>
      <label htmlFor="choose-passport" className={style.label}>
        {label}
      </label>
      <select
        id="choose-passport"
        className={style.select}
        onChange={(e) => {
          if (handleSelect) {
            handleSelect(e.target.value)
          }
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectPassport
