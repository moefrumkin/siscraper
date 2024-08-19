import { AgGridReact, CustomFilterProps } from "ag-grid-react"
import { ColumnMeta, Course, Filter } from "siscraper-shared"
import { ColumnFilter } from "./ColumnFilter"
import { RowClickedEvent } from "ag-grid-community"

export type CourseTableProps = {
    courses: Course[],
    headers: ColumnMeta[],
    onCourseSelected?: (course: Course) => void
}

export const CourseTable = ({courses, headers, onCourseSelected}: CourseTableProps) => {
  const onRowClicked = (event: RowClickedEvent<Course, unknown>) => {
    const course = event.data;

    if(course != null && onCourseSelected !== undefined) {
      onCourseSelected(course)
    }
  }


  return (<AgGridReact<Course>
    pagination={true}
    paginationPageSize={500}
    paginationPageSizeSelector={[200, 500, 2000]}
    suppressCellFocus
    rowData={courses}
    columnDefs={headers.map(key => ({
      headerName: key.readableName,
      field: key.name,
      filter: makeFilter<Course>(key.filters)
    }))}
    onRowClicked={onRowClicked}
  />)
}

const makeFilter = <T,>(filters: Filter<T>[] | undefined) => (
  filters === undefined? null:
    ((filterProps: CustomFilterProps<T>) => <ColumnFilter<T> filters={filters} filterProps = {filterProps}/>)
)