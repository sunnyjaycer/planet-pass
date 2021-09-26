import { FunctionComponent, useState } from 'react'
import style from './FilterableGrid.module.scss'

type FilterDrawProps = {
  heading: string
}

const FilterDrawer: FunctionComponent<FilterDrawProps> = ({
  heading,
  children
}) => {
  const [expanded, setExpanded] = useState(false)

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
          {heading}
        </button>
      </h3>
      {expanded && <div className={style.filterDrawerContents}>{children}</div>}
    </div>
  )
}

export default FilterDrawer
