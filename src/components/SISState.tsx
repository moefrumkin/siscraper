import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';
import Select, { CSSObjectWithLabel, GroupBase } from 'react-select'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"
import { School, Term, Department, Course, ColumnMeta, DefaultColumns, CourseHeader, SearchQuery, Labeled } from '../lib/datatypes';

const SISState = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [schools, setSchools] = useState<Array<School>>([])
    const [terms, setTerms] = useState<Array<Term>>([])

    const [selectedSchools, setSelectedSchools] = useState<Array<School>>([])
    const [selectedDepartments, setSelectedDeparments] = useState<Array<Department>>([])
    const [selectedTerms, setSelectedTerms] = useState<Array<Term>>([])

    const [courses, setCourses] = useState<Array<Course>>([])

    const [headers, setHeaders] = useState<ColumnMeta[]>(DefaultColumns)

    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const promisedSchools = httpsCallable<void, Array<School>>(firebaseFunctions, "getSchools")()
            .then(result => {
                const schools = result.data

                const getDepartments = httpsCallable<{school: string}, Array<Department>>(firebaseFunctions, "getDepartments")
                return Promise.all(schools.map(school =>
                    getDepartments({ school: school.Name }).then(departments => {
                        return {
                            Name: school.Name,
                            Departments: departments.data
                        }
                    })
                ))
            })
            .then(setSchools)

        const promisedTerms = httpsCallable<void, Array<Term>>(firebaseFunctions, "getTerms")()
            .then(result => setTerms(result.data))

        Promise.all([promisedSchools, promisedTerms])
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])

    const searchCourses = () => {
        httpsCallable<SearchQuery, Array<Course>>(firebaseFunctions, "searchCourses")({
            terms: selectedTerms.map(term => term.Name),
            schools: selectedSchools.map(school => school.Name),
            departments: selectedDepartments
        })
            .then(result => setCourses(result.data))
            .catch(setError)
    }

    const menuStyle = {
        option: (provided: CSSObjectWithLabel, _: unknown) => ({
            ...provided,
            color: "#000000"
        }),
    }

    return (
        <div>
            {error && <APIError error={error} />}
            {loading ? <p>Loading</p> :
                <div>
                    <Select isMulti
                        styles={menuStyle}
                        options={schools.map(school => ({ value: school, label: school.Name }))}
                        onChange={selection => setSelectedSchools(selection.map(selection => selection.value))}
                    />
                    <Select<Labeled<Department>, true, Labeled<School> & { readonly options: readonly Labeled<Department>[] }> 
                        isMulti
                        styles={menuStyle}

                        options={schools
                            .filter(school => !selectedSchools.includes(school))
                            .map(school => ({
                                value: school,
                                label: school.Name,
                                options: school.Departments.map(department => ({ value: department, label: department.DepartmentName }))
                            }))}
                        onChange={selection => setSelectedDeparments(selection.map(selection => selection.value))}
                        formatGroupLabel={school => (
                            <div>
                                <span>{school.label}</span>
                            </div>
                        )}
                    />
                    <Select isMulti
                        styles={menuStyle}
                        options={terms.map(term => ({ value: term, label: term.Name }))}
                        onChange={selection => setSelectedTerms(selection.map(selection => selection.value))}
                    />
                    <button onClick={searchCourses}>Search Courses</button>
                    <button onClick={() => {setCourses([]); setError(null)}}>Clear</button>
                    <Select<Labeled<ColumnMeta>, true, GroupBase<Labeled<ColumnMeta>>>
                        isMulti
                        styles={menuStyle}
                        options={Object.values(CourseHeader).map(header => ({value: header, label: header.readableName}))}
                        defaultValue={DefaultColumns.map(column => ({value: column, label: column.readableName}))}
                        onChange={selection => setHeaders(selection.map(column => column.value))}
                    />
                    {courses.length > 0 && <div className='ag-theme-quartz' style={{ height: "50em", width: "100em" }}>
                        <AgGridReact<Course>
                            pagination={true}
                            paginationPageSize={500}
                            paginationPageSizeSelector={[200, 500, 2000]}
                            rowData={courses}
                            columnDefs={headers.map(key => ({ headerName: key.readableName, field: key.name }))} />
                    </div>}
                </div>}
        </div>
    )
}

const APIError = (props: { error: Error }) => (
    <div>
        <h2>An error occured:</h2>
        <p>{props.error.name}: {props.error.message}</p>
        <p>{props.error.stack}</p>
    </div>
)

export default SISState