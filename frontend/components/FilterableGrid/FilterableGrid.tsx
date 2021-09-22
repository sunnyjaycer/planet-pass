import { FunctionComponent, useState } from 'react'
import FilterDrawer from './FilterDrawer'
import style from './FilterableGrid.module.scss'
import CardGrid from '../CardGrid'
import Card from '../Card'

type FilterValue = {
  value: string
  active: boolean
}

type Filter = {
  name: string
  values: Array<string>
  stateValues?: Array<FilterValue>
}

const filters: Array<Filter> = [
  { name: 'Space', values: ['foo', 'bar', 'bat'] },
  { name: 'Core Type', values: ['ice', 'lava'] },
  { name: 'Terrain', values: ['grass', 'mountain', 'valley'] },
  { name: 'Features', values: ['foo', 'bar', 'bat'] },
  { name: 'Atmosphere', values: ['foo', 'bar', 'bat'] },
  { name: 'Satellites', values: ['foo', 'bar', 'bat'] },
  { name: 'Ships', values: ['foo', 'bar', 'bat'] },
  { name: 'Anomalies', values: ['foo', 'bar', 'bat'] },
  { name: 'Diameter', values: ['foo', 'bar', 'bat'] },
  { name: 'Age', values: ['foo', 'bar', 'bat'] },
  { name: 'Faction', values: ['foo', 'bar', 'bat'] },
  {
    name: 'Distance from Center of Galaxy',
    values: ['foo', 'bar', 'bat']
  }
]

type FilterState = {
  [index: string]: boolean
}
type FilterGroupState = {
  [index: string]: FilterState
}

const initFilterState: FilterGroupState = {}

filters.forEach((filter) => {
  initFilterState[filter.name] = {}

  filter.values.forEach((filterValue) => {
    initFilterState[filter.name][filterValue] = false
  })
})

type FilterableGridProps = {
  data: Array<any>
}

type ActiveFilter = {
  name: string
  value: string
}

type ActiveFilterList = Array<ActiveFilter>

const FilterableGrid: FunctionComponent<FilterableGridProps> = ({ data }) => {
  const [filterState, setFilterState] = useState(initFilterState)

  const handleFilterChange = (filterName: string, filterVal: string): void => {
    const newState = { ...filterState }
    newState[filterName][filterVal] = !newState[filterName][filterVal]
    setFilterState(newState)
  }

  const activeFilters: ActiveFilterList = []

  filters.forEach((filter) => {
    filter.values.forEach((filterValue) => {
      if (filterState[filter.name][filterValue]) {
        activeFilters.push({ name: filter.name, value: filterValue })
      }
    })
  })

  return (
    <div className={style.filterableGrid}>
      <div className={style.filterContainer}>
        <div className={style.filters}>
          <div className={style.filterCell}>
            <h2>Filters</h2>
          </div>
          {filters.map((filter) => (
            <FilterDrawer heading={filter.name} key={`${filter.name}`}>
              <ul className={style.filterValList}>
                {filter.values.map((filterVal) => (
                  <li
                    key={`${filter.name}${filterVal}`}
                    className={style.filterItem}
                  >
                    <input
                      id={`${filter.name}${filterVal}`}
                      type="checkbox"
                      checked={filterState[filter.name][filterVal]}
                      onChange={() => {
                        handleFilterChange(filter.name, filterVal)
                      }}
                    />
                    <label htmlFor={`${filter.name}${filterVal}`}>
                      {filterVal}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterDrawer>
          ))}
        </div>
      </div>
      <div className={style.activeFilterContainer}>
        {activeFilters.map((activeFilter) => (
          <button
            className={style.activeFilterTag}
            key={`${activeFilter.name}${activeFilter.value}`}
            onClick={() => {
              handleFilterChange(activeFilter.name, activeFilter.value)
            }}
          >
            {activeFilter.value}
          </button>
        ))}
      </div>
      <div className={style.cardContainer}>
        <CardGrid noPad>
          {data.map((cardData) => (
            <Card
              name={cardData.name}
              visits={cardData.visits}
              price={cardData.price}
              imgSrc={cardData.imgSrc}
              key={cardData.id}
            />
          ))}
        </CardGrid>
      </div>
    </div>
  )
}

export default FilterableGrid
