import { FunctionComponent, useState } from 'react'
import style from './FilterableGrid.module.scss'
import { FilterGroupState, FilterSet, Filter } from '../../types'

type FilterDrawProps = {
  filterState: FilterGroupState
  filter: FilterSet
  handleFilterChange: (f: Filter) => void
}

const FilterDrawer: FunctionComponent<FilterDrawProps> = ({
  filterState,
  filter,
  handleFilterChange
}) => {
  const [expanded, setExpanded] = useState(false)
  const [textFilterState, setTextFilterState] = useState('')
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTextFilterState(e.currentTarget.value.toLowerCase())
  }
  return (
    <div
      className={`${style.filterCell} ${
        expanded ? style.filterCellExpanded : ''
      }`}
    >
      <h3>
        <button
          aria-expanded={expanded}
          onClick={() => {
            setExpanded(!expanded)
          }}
        >
          {filter.name}
        </button>
      </h3>
      {expanded && (
        <div>
          <input
            type="text"
            aria-label="Filter list"
            placeholder="Filter"
            className={style.filterInput}
            onChange={handleInputChange}
            value={textFilterState}
          />
          <div className={style.filterDrawerContents}>
            <ul className={style.filterValList}>
              {filter.values
                .filter(
                  (filterVal) =>
                    textFilterState === '' ||
                    filterVal.toLowerCase().includes(textFilterState)
                )
                .map((filterVal) => (
                  <li
                    key={`${filter.name}${filterVal}`}
                    className={style.filterItem}
                  >
                    <input
                      id={`${filter.name}${filterVal}`}
                      type="checkbox"
                      checked={filterState[filter.name][filterVal]}
                      onChange={() => {
                        handleFilterChange({
                          name: filter.name,
                          value: filterVal
                        })
                      }}
                    />
                    <label htmlFor={`${filter.name}${filterVal}`}>
                      {filterVal}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterDrawer
