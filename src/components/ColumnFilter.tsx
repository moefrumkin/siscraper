import { CustomFilterProps, useGridFilter } from "ag-grid-react";
import { Filter } from "siscraper-shared";
import { useCallback, useMemo } from "react";

/**
 * Properties for a custom column filter.
 */
export type ColumnFilterProps<T> = {
  filters: Filter<T>[],
  filterProps: CustomFilterProps<T, unknown, Set<Filter<T>>>
}

/**
 * A custom filter for the course display table. 
 * An item passes the filter if it passes one of the predicates in the props
 */
export const ColumnFilter = <T,>({filters, filterProps}: ColumnFilterProps<T>) => {
  const {onModelChange, model} = filterProps;

  // By default, all filters are active
  const defaultSelection = useMemo(() => new Set(filters), [filters])

  // If the model is null, use the default selection
  const selectedFilters = model || defaultSelection;

  const onFilterChanged = (filter: Filter<T>, active: boolean) => {
    // Copy the current set of filters
    const currentFilters = new Set(selectedFilters);

    // Toggle the changed filter
    if(active) {
      currentFilters.add(filter)
    } else {
      currentFilters.delete(filter)
    }

    // Update the model
    onModelChange(currentFilters)
  }

  const invertSelection = () => {
    onModelChange(new Set(filters.filter(filter => !selectedFilters.has(filter))))
  }

  const doesFilterPass = useCallback(({data}: {data: T, node: unknown}) => (
    Array.from(selectedFilters).some(filter => filter.predicate(data))
  ), [selectedFilters])

  const resetSelection = () => {
    onModelChange(defaultSelection)
  }

  useGridFilter({doesFilterPass})

  return (
    <div>
      <span>Filters</span>
      <form>
        {
          filters.map(filter => 
            <div key={filter.name}>
              <p>{filter.name}</p>
              <input
                type="checkbox"
                checked = {selectedFilters.has(filter)}
                onChange={(event) => onFilterChanged(filter, event.target.checked)}/>
            </div>
          )
        }
      </form>
      <button onClick={resetSelection}>Reset Selection</button>
      <button onClick={invertSelection}>Invert Selection</button>
    </div>
  )
}