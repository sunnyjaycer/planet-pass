import { FunctionComponent } from 'react'
import style from './FilterableGrid.module.scss'
import { Filter } from '../../types'

interface FilterTabProps {
  label?: string
  value: string
  bold?: boolean
  handleClick: () => void
}

const FilterTab: FunctionComponent<FilterTabProps> = ({
  label,
  value,
  bold = false,
  handleClick
}) => {
  return (
    <button
      className={`${style.activeFilterTag} ${bold ? style.bold : ''}`}
      onClick={handleClick}
    >
      {label && <span className={style.filterTagLabel}>{label}: </span>}
      {value}
    </button>
  )
}

export default FilterTab
