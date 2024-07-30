import { CustomFilterProps, useGridFilter } from "ag-grid-react";
import { Filter } from "../lib/datatypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const ColumnFilter = <T,>({filters, filterProps}: {filters: Filter<T>[], filterProps: CustomFilterProps<T, unknown, Set<Filter<T>>>}) => {
    //TODO: we should be able to eliminate this by storing thins on ly in model
    const [activeFilters, setActiveFilters] = useState<Set<Filter<T>>>(new Set())

    const formRef = useRef(null);

    const {onModelChange, model} = filterProps;

    useEffect(() => {
        onModelChange(activeFilters)
    }, [activeFilters, onModelChange])

    const checkboxClicked = (filter: Filter<T>, active: boolean) => {
        const filters = new Set(activeFilters);

        if(active) {
            filters.add(filter)
        } else {
            filters.delete(filter)
        }

        setActiveFilters(filters)
    }

    const invertSelection = () => {
        setActiveFilters(new Set(filters.filter(filter => !activeFilters.has(filter))))
    }

    const doesFilterPass = useCallback(({data}: {data: T, node: unknown}) => (
        model == null ||
            model.size == 0 ||
            Array.from(model).some(filter => filter.predicate(data))
    ), [model])

    useGridFilter({doesFilterPass})

    return (
        <div>
            <span>Filters</span>
            <form ref={formRef}>
            {
                filters.map(filter => 
                    <div key={filter.name}>
                        <p>{filter.name}</p>
                        <input type="checkbox" checked = {activeFilters.has(filter)} onChange={(event) => checkboxClicked(filter, event.target.checked)}/>
                    </div>
                )
            }
            </form>
            <button onClick={() => setActiveFilters(new Set())}>Clear Selection</button>
            <button onClick={invertSelection}>Invert Selection</button>
        </div>
    )
}