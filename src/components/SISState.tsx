import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';
import Select, { CSSObjectWithLabel, GroupBase } from 'react-select'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"

type School = {
    Name: string
    Departments: Array<Department>
}

type Department = {
    DepartmentName: string
    SchoolName: string
}

type Term = {
    Name: string
}

type Course = {
    TermStartDate: string,
    SchoolName: string,
    CoursePrefix: string,
    Term: string,
    Term_IDR: string,
    OfferingName: string,
    SectionName: string,
    Title: string,
    Credits: string,
    Department: string,
    Level: string,
    Status: string,
    DOW: string,
    DOWSort: string,
    TimeofDay: string,
    SubDepartment: string,
    SectionRegRestriction: string,
    Prerequisite: string,
    SeatsAvailable: string,
    MaxSeats: string,
    OpenSeats: string,
    Waitlisted: string,
    IsWritingIntensive: string,
    AllDepartments: string,
    Instructors: string,
    InstructorsFullName: string,
    Location: string,
    Building: string,
    HasBio: string,
    Meetings: string,
    Areas: string,
    InstructionMethod: string,
    SectionCoRequisites: string,
    SectionCoReqNotes: string,
    SSS_SectionsID: string,
    Term_JSS: string,
    Repeatable: string,
    SectionDetail: string
}

type ColumnMeta = {
    name: keyof Course,
    readableName: string,
}

const CourseHeader: { [key in (keyof Course)]: ColumnMeta } = {
    TermStartDate: {
        name: "TermStartDate",
        readableName: "Term Start Date"
    },
    SchoolName: {
        name: "SchoolName",
        readableName: "School Name"
    },
    CoursePrefix: {
        name: "CoursePrefix",
        readableName: "Course Prefix"
    },
    Term: {
        name: "Term",
        readableName: "Term"
    },
    Term_IDR: {
        name: "Term_IDR",
        readableName: "Term IDR"
    },
    OfferingName: {
        name: "OfferingName",
        readableName: "Offering Name"
    },
    SectionName: {
        name: "SectionName",
        readableName: "Section Name"
    },
    Title: {
        name: "Title",
        readableName: "Title"
    },
    Credits: {
        name: "Credits",
        readableName: "Credits"
    },
    Department: {
        name: "Department",
        readableName: "Department"
    },
    Level: {
        name: "Level",
        readableName: "Level"
    },
    Status: {
        name: "Status",
        readableName: "Status"
    },
    DOW: {
        name: "DOW",
        readableName: "Days of Week"
    },
    DOWSort: {
        name: "DOWSort",
        readableName: "Days of Week for Sort"
    },
    TimeofDay: {
        name: "TimeofDay",
        readableName: "Does Instructor Have Bio"
    },
    SubDepartment: {
        name: "SubDepartment",
        readableName: "Subdepartment"
    },
    SectionRegRestriction: {
        name: "SectionRegRestriction",
        readableName: "Sections Registration Restriction"
    },
    Prerequisite: {
        name: "Prerequisite",
        readableName: "Prerequisites"
    },
    SeatsAvailable: {
        name: "SeatsAvailable",
        readableName: "Seats Available"
    },
    MaxSeats: {
        name: "MaxSeats",
        readableName: "Maximum Seats"
    },
    OpenSeats: {
        name: "OpenSeats",
        readableName: "Open Seats"
    },
    Waitlisted: {
        name: "Waitlisted",
        readableName: "Waitlist Length"
    },
    IsWritingIntensive: {
        name: "IsWritingIntensive",
        readableName: "Writing Intensive"
    },
    AllDepartments: {
        name: "AllDepartments",
        readableName: "All Departments"
    },
    Instructors: {
        name: "Instructors",
        readableName: "Instructors"
    },
    InstructorsFullName: {
        name: "InstructorsFullName",
        readableName: "Instructors Full Name"
    },
    Location: {
        name: "Location",
        readableName: "Location"
    },
    Building: {
        name: "Building",
        readableName: "Building"
    },
    HasBio: {
        name: "HasBio",
        readableName: "Instructor Biography"
    },
    Meetings: {
        name: "Meetings",
        readableName: "Meetings"
    },
    Areas: {
        name: "Areas",
        readableName: "Areas"
    },
    InstructionMethod: {
        name: "InstructionMethod",
        readableName: "Instruction Method"
    },
    SectionCoRequisites: {
        name: "SectionCoRequisites",
        readableName: "Section Corequisites"
    },
    SectionCoReqNotes: {
        name: "SectionCoReqNotes",
        readableName: "Section Corequisite Notes"
    },
    SSS_SectionsID: {
        name: "SSS_SectionsID",
        readableName: "SSS_SectinsID"
    },
    Term_JSS: {
        name: "Term_JSS",
        readableName: "Term JSS"
    },
    Repeatable: {
        name: "Repeatable",
        readableName: "Repeatable"
    },
    SectionDetail: {
        name: "SectionDetail",
        readableName: "Section Detail"
    }
}

const DefaultColumns: ColumnMeta[] = [
    CourseHeader.SchoolName,
    CourseHeader.Term,
    CourseHeader.OfferingName,
    CourseHeader.SectionName,
    CourseHeader.Title,
    CourseHeader.Credits,
    CourseHeader.Department,
    CourseHeader.Level,
    CourseHeader.Status,
    CourseHeader.SeatsAvailable,
    CourseHeader.MaxSeats,
    CourseHeader.OpenSeats,
    CourseHeader.Waitlisted
]

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

    //TODO: synchronize finish
    useEffect(() => {
        httpsCallable<void, Array<School>>(firebaseFunctions, "getSchools")()
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
            .catch(setError)
            .finally(() => setLoading(false))

        httpsCallable<void, Array<Term>>(firebaseFunctions, "getTerms")()
            .then(result => setTerms(result.data))
            .catch(setError)
    }, [])

    const searchCourses = () => {
        //TODO: Update the input type
        httpsCallable<object, Array<Course>>(firebaseFunctions, "searchCourses")({
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
                    <Select<{ value: Department, label: string }, true, { value: School, label: string, readonly options: readonly { value: Department, label: string }[] }> isMulti
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
                    <Select<{value: ColumnMeta, label: string}, true, GroupBase<{value: ColumnMeta, label: string}>>
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