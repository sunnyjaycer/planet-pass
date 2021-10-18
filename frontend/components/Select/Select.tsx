import { FunctionComponent } from 'react'
import style from './Select.module.scss'

type SelectProps = {
  options: string[]
  label: string
  handleSelect?: (s: string) => void
  id: string
  defaultValue?: string
}

const Select: FunctionComponent<SelectProps> = ({
  label,
  options,
  handleSelect,
  id,
  defaultValue
}) => {
  return (
    <div className={style.selectWrap}>
      <label htmlFor={id} className={style.label}>
        {label}
      </label>
      <select
        id={id}
        className={style.select}
        onChange={(e) => {
          if (handleSelect) {
            handleSelect(e.target.value)
          }
        }}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            selected={option === defaultValue}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
