import { FunctionComponent } from 'react'
import style from './FilterableGrid.module.scss'
import { Filter } from '../../types'

interface FilterTabProps {
  filter: Filter
  handleFilterChange: (a: Filter) => void
}

const FilterTab: FunctionComponent<FilterTabProps> = ({
  filter,
  handleFilterChange
}) => {
  return (
    <button
      className={style.activeFilterTag}
      onClick={() => {
        handleFilterChange(filter)
      }}
    >
      <span className={style.filterTagLabel}>{filter.name}:</span>{' '}
      {filter.value}
    </button>
  )
}

export default FilterTab
