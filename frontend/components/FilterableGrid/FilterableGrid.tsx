import { FunctionComponent, useState } from 'react'
import FilterDrawer from './FilterDrawer'
import style from './FilterableGrid.module.scss'
import DetailsModal from '../DetailsModal'
import FilteredItems from './FilteredItems'
import { PlanetData, FilterSet, FilterGroupState, Filter } from '../../types'
import FilterTab from './FilterTab'
import planetManifest from '../../assets/planetManifest.json'

const filters: Array<FilterSet> = []
// const filters: Array<FilterSet> = [
//   { name: 'Space', values: ['bright', 'dark'] },
//   { name: 'Core Type', values: ['ice', 'lava'] },
// ]
planetManifest.forEach((category) => {
  category.subcategories.forEach((subcategory) => {
    filters.push({
      name: subcategory.readableName,
      values: subcategory.files.map((file) => file.readableName)
    })
  })
})

const createDefaultFilterState = () => {
  // Assemble filter state object
  const initFilterState: FilterGroupState = {}
  filters.forEach((filter) => {
    initFilterState[filter.name] = {}
    filter.values.forEach((filterValue) => {
      initFilterState[filter.name][filterValue] = false
    })
  })

  return initFilterState
}

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

  const [filterState, setFilterState] = useState(createDefaultFilterState())

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
          videoSrc={modalData.animation_url}
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
            <FilterDrawer
              key={`filterDrawer ${filter.name}`}
              filterState={filterState}
              filter={filter}
              handleFilterChange={handleFilterChange}
            ></FilterDrawer>
          ))}
        </div>
      </div>

      <div className={style.filterGridContent}>
        {/* ----- */}
        {/* ACTIVE FILTER TABS */}
        <div className={style.activeFilterContainer}>
          {activeFilters.map((filter) => (
            <FilterTab
              label={filter.name}
              value={filter.value}
              handleClick={() => {
                handleFilterChange(filter)
              }}
              key={`${filter.name}${filter.value}`}
            />
          ))}

          {activeFilters.length > 0 && (
            <FilterTab
              value="CLEAR ALL"
              handleClick={() => {
                setFilterState(createDefaultFilterState())
              }}
              bold
            />
          )}
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
