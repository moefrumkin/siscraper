import { CustomFilterProps, useGridFilter } from "ag-grid-react";
import { Filter } from "../lib/datatypes";
import { useCallback, useMemo } from "react";

export const ColumnFilter = <T,>({filters, filterProps}: {filters: Filter<T>[], filterProps: CustomFilterProps<T, unknown, Set<Filter<T>>>}) => {
  const {onModelChange, model} = filterProps;

  const defaultSelection = useMemo(() => new Set(filters), [filters])

  const selectedFilters = model || defaultSelection;

  const checkboxClicked = (filter: Filter<T>, active: boolean) => {
    const filters = new Set(selectedFilters);

    if(active) {
      filters.add(filter)
    } else {
      filters.delete(filter)
    }

    onModelChange(filters)
  }

  const invertSelection = () => {
    onModelChange(new Set(filters.filter(filter => !selectedFilters.has(filter))))
  }

  const doesFilterPass = useCallback(({data}: {data: T, node: unknown}) => (
    Array.from(selectedFilters).some(filter => filter.predicate(data))
  ), [selectedFilters])

  useGridFilter({doesFilterPass})

  return (
    <div>
      <span>Filters</span>
      <form>
        {
          filters.map(filter => 
            <div key={filter.name}>
              <p>{filter.name}</p>
              <input type="checkbox" checked = {selectedFilters.has(filter)} onChange={(event) => checkboxClicked(filter, event.target.checked)}/>
            </div>
          )
        }
      </form>
      <button onClick={() => onModelChange(defaultSelection)}>Reset Selection</button>
      <button onClick={invertSelection}>Invert Selection</button>
    </div>
  )
}