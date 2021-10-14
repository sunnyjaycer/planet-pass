import { FunctionComponent } from 'react'
import style from './FilterableGrid.module.scss'
import CardGrid from '../CardGrid'
import Card from '../Card'
import { PlanetData, FilterGroupState, Filter } from '../../types'

type FilteredItemsProps = {
  itemData: PlanetData[]
  handlePlanetClick?: (a: PlanetData) => void
  filterState: FilterGroupState
  activeFilters: Filter[]
}

const FilteredItems: FunctionComponent<FilteredItemsProps> = ({
  itemData,
  handlePlanetClick,
  filterState,
  activeFilters
}) => {
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
    <>
      <div className={style.results}>{numActive} Results</div>
      {/* ----- */}
      {/* FILTER CARDS */}
      <div className={style.cardContainer}>
        <CardGrid noPad largeCards>
          {filteredItems.map((cardData) => (
            <div key={cardData.id}>
              <Card
                name={cardData.name}
                price={cardData.price}
                imgSrc={cardData.thumbnail}
                stampSrc={cardData.stampSrc}
                onClick={() => {
                  if (handlePlanetClick) {
                    handlePlanetClick(cardData)
                  }
                }}
              />
              <br />
              {/* <div className={style.debug}>
                <strong>Temporary Debug attributes:</strong>
                <br />
                {cardData.attributes.map((attr) => (
                  <span key={`${attr.trait_type}${attr.value}`}>
                    {attr.trait_type}: {attr.value} <br />
                  </span>
                ))}
              </div> */}
            </div>
          ))}
        </CardGrid>
      </div>
    </>
  )
}

export default FilteredItems
