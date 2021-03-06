import { FunctionComponent, useState } from 'react'
import FilterDrawer from './FilterDrawer'
import style from './FilterableGrid.module.scss'
import DetailsModal from '../DetailsModal'
import FilteredItems from './FilteredItems'
import { PlanetData, FilterSet, FilterGroupState, Filter } from '../../types'
import FilterTab from './FilterTab'

// TODO Handle number values as filters
const filters: Array<FilterSet> = [
  { name: 'Space', values: ['bright', 'dark'] },
  { name: 'Core Type', values: ['ice', 'lava'] },
  { name: 'Terrain', values: ['grass', 'mountain', 'valley'] },
  { name: 'Features', values: ['cave', 'lake'] },
  { name: 'Atmosphere', values: ['oxygen', 'hydrogen', 'nitrogen'] },
  { name: 'Satellites', values: ['asteroid', 'mechanical'] },
  { name: 'Ships', values: ['death star', 'x-wing'] },
  { name: 'Anomalies', values: ['squishy', 'smelly', 'hamburger'] },
  { name: 'Diameter', values: ['real small', 'average', 'real big'] },
  { name: 'Age', values: ['1', '2', '3'] },
  { name: 'Faction', values: ['good', 'bad', 'neutral'] },
  {
    name: 'Distance from Center of Galaxy',
    values: ['near', 'far', 'wherever you are']
  }
]

// Assemble filter state object
const initFilterState: FilterGroupState = {}
filters.forEach((filter) => {
  initFilterState[filter.name] = {}
  filter.values.forEach((filterValue) => {
    initFilterState[filter.name][filterValue] = false
  })
})

interface FilterableGridProps {
  itemData: PlanetData[]
}

const FilterableGrid: FunctionComponent<FilterableGridProps> = ({
  itemData
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalData, setModalData] = useState<PlanetData | null>()

  const handlePlanetClick = (cardData: PlanetData) => {
    setModalIsOpen(true)
    setModalData(cardData)
  }

  const [filterState, setFilterState] = useState(initFilterState)

  const handleFilterChange = (filter: Filter): void => {
    const newState = { ...filterState }
    newState[filter.name][filter.value] = !newState[filter.name][filter.value]
    setFilterState(newState)
  }

  // Create list of filters from filterState which are active
  const activeFilters: Filter[] = []
  filters.forEach((filter) => {
    filter.values.forEach((filterValue) => {
      if (filterState[filter.name][filterValue]) {
        activeFilters.push({ name: filter.name, value: filterValue })
      }
    })
  })

  return (
    <div className={style.filterableGrid}>
      {modalData && (
        <DetailsModal
          isOpen={modalIsOpen}
          name={modalData.name}
          attributes={modalData.attributes}
          price={modalData.price}
          videoSrc={modalData.videoSrc}
          handleClose={() => {
            setModalIsOpen(false)
            setModalData(null)
          }}
        />
      )}
      <div className={style.filterContainer}>
        {/* ----- */}
        {/* FILTER SIDEBAR */}
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
            </FilterDrawer>
          ))}
        </div>
      </div>

      <div className={style.filterGridContent}>
        {/* ----- */}
        {/* ACTIVE FILTER TABS */}
        <div className={style.activeFilterContainer}>
          {activeFilters.map((filter) => (
            <FilterTab
              filter={filter}
              handleFilterChange={handleFilterChange}
              key={`${filter.name}${filter.value}`}
            />
          ))}
        </div>

        <FilteredItems
          itemData={itemData}
          handlePlanetClick={handlePlanetClick}
          filterState={filterState}
          activeFilters={activeFilters}
        />
      </div>
    </div>
  )
}

export default FilterableGrid
