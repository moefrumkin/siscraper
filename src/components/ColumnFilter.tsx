import { CustomFilterProps, useGridFilter } from "ag-grid-react";
import { Filter } from "../lib/datatypes";
import { useCallback, useState } from "react";

export const ColumnFilter = <T,>({filters, filterProps}: {filters: Filter<T>[], filterProps: CustomFilterProps<T, unknown, Set<Filter<T>>>}) => {
    const [activeFilters, setActiveFilters] = useState<Set<Filter<T>>>(new Set())

    const {onModelChange, model} = filterProps;

    const checkboxClicked = (filter: Filter<T>, active: boolean) => {
        if(active) {
            activeFilters.add(filter)
        } else {
            activeFilters.delete(filter)
        }

        setActiveFilters(activeFilters)

        onModelChange(activeFilters)
        console.log("updating model")
    }

    const doesFilterPass = useCallback(({data, node}: {data: T, node: unknown}) => {
        if(model == null) {
            return true;
        }
        else{
            return    Array.from(model).every(filter => {console.log(data); return filter.predicate(data)})
        }
    }, [model])

    useGridFilter({doesFilterPass})

    return (
        <div>
            <span>Filters</span>
            {
                filters.map(filter => 
                    <div key={filter.name}>
                        <p>{filter.name}</p>
                        <input type="checkbox" onChange={(event) => checkboxClicked(filter, event.target.checked)}/>
                    </div>
                )
            }
        </div>
    )
}