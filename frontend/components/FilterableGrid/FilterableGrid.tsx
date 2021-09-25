import { FunctionComponent, useState } from 'react'
import FilterDrawer from './FilterDrawer'
import style from './FilterableGrid.module.scss'
import CardGrid from '../CardGrid'
import Card from '../Card'
import DetailsModal from '../DetailsModal'
import { PlanetData } from '../../types'

type FilterSet = {
  name: string
  values: Array<string>
}
type FilterState = {
  [index: string]: boolean
}
type FilterGroupState = {
  [index: string]: FilterState
}
type ActiveFilter = {
  name: string
  value: string
}

type ActiveFilterList = Array<ActiveFilter>

type FilterableGridProps = {
  itemData: PlanetData[]
}

// TODO Handle number values

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

const initFilterState: FilterGroupState = {}

filters.forEach((filter) => {
  initFilterState[filter.name] = {}

  filter.values.forEach((filterValue) => {
    initFilterState[filter.name][filterValue] = false
  })
})

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

  const handleFilterChange = (filterName: string, filterVal: string): void => {
    const newState = { ...filterState }
    newState[filterName][filterVal] = !newState[filterName][filterVal]
    setFilterState(newState)
  }

  // Create list of filters from filterState which are active
  const activeFilters: ActiveFilterList = []
  filters.forEach((filter) => {
    filter.values.forEach((filterValue) => {
      if (filterState[filter.name][filterValue]) {
        activeFilters.push({ name: filter.name, value: filterValue })
      }
    })
  })

  const activeFilterShape: FilterGroupState = {}
  for (const category in filterState) {
    Object.entries(filterState[category])
      .filter(([prop, val]) => val === true)
      .forEach(([entryName, val]) => {
        if (!activeFilterShape.hasOwnProperty(category)) {
          activeFilterShape[category] = {}
        }
        activeFilterShape[category][entryName] = true
      })
  }

  const filteredItems =
    activeFilters.length > 0
      ? itemData.filter((item, i) => {
          const filterGroups = Object.entries(activeFilterShape)
          const categoriesFound: boolean[] = []

          // Find if each active filter category is met in the item's attributes
          filterGroups.forEach(([category, values]) => {
            const itemIsCategoryActive = item.attributes.findIndex(
              (el) => el.trait_type === category && values[el.value]
            )
            categoriesFound.push(itemIsCategoryActive !== -1)
          })

          const isActive = categoriesFound.reduce(
            (prev, next) => prev && next,
            true
          )
          return isActive
        })
      : itemData

  const numActive = filteredItems.length

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

      <div className={style.filterGridContent}>
        {/* ----- */}
        {/* ACTIVE FILTER TABS */}
        <div className={style.activeFilterContainer}>
          {activeFilters.map((activeFilter) => (
            <button
              className={style.activeFilterTag}
              key={`${activeFilter.name}${activeFilter.value}`}
              onClick={() => {
                handleFilterChange(activeFilter.name, activeFilter.value)
              }}
            >
              <span className={style.filterTagLabel}>{activeFilter.name}:</span>{' '}
              {activeFilter.value}
            </button>
          ))}
        </div>

        <div className={style.results}>{numActive} Results</div>
        {/* ----- */}
        {/* FILTER CARDS */}
        <div className={style.cardContainer}>
          <CardGrid noPad>
            {filteredItems.map((cardData) => (
              <div key={cardData.id}>
                <Card
                  name={cardData.name}
                  price={cardData.price}
                  imgSrc={cardData.imgSrc}
                  onClick={() => {
                    handlePlanetClick(cardData)
                  }}
                />
                <br />
                <div className={style.debug}>
                  <strong>Temporary Debug attributes:</strong>
                  <br />
                  {cardData.attributes.map((attr) => (
                    <span key={`${attr.trait_type}${attr.value}`}>
                      {attr.trait_type}: {attr.value} <br />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardGrid>
        </div>
      </div>
    </div>
  )
}

export default FilterableGrid
