import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';
import Select from 'react-select'
import { AgGridReact } from 'ag-grid-react';

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

const CourseHeader = {
    TermStartDate: "Term Start Date",
    SchoolName: "School Name",
    CoursePrefix: "Course Prefix",
    Term: "Term",
    Term_IDR: "Term IDR",
    OfferingName: "Offering Name",
    SectionName: "Section Name",
    Title: "Title",
    Credits: "Credits",
    Department: "Department",
    Level: "Level",
    Status: "Status",
    DOW: "Days of Week",
    DOWSort: "Days of Week for Sort",
    TimeofDay: "Does Instructor Have Bio",
    SubDepartment: "Subdepartment",
    SectionRegRestrictions: "Sections Registration Restriction",
    Prerequisite: "Prerequisites",
    SeatsAvailable: "Seats Available",
    MaxSeats: "Maximum Seats",
    OpenSeats: "Open Seats",
    Waitlisted: "Waitlist Length",
    IsWritingIntensive: "Writing Intensive",
    AllDepartments: "All Departments",
    Instructors: "Instructors",
    InstructorsFullName: "Instructors Full Name",
    Location: "Location",
    Building: "Building",
    HasBio: "Instructor Biography",
    Meetings: "Meetings",
    Areas: "Areas",
    InstructionMethod: "Instruction Method",
    SectionCoRequisites: "Section Corequisites",
    SectionCoReqNotes: "Section Corequisite Notes",
    SSS_SectionsID: "SSS_SectinsID",
    Term_JSS: "Term JSS",
    Repeatable: "Repeatable",
    SectionDetail: "Section Detail"
}

const SISState = () => {
    const [loading, setLoading] = useState<Boolean>(true)
    const [schools, setSchools] = useState<Array<School>>([])
    const [terms, setTerms] = useState<Array<Term>>([])

    const [selectedSchools, setSelectedSchools] = useState<Array<School>>([])
    const [selectedDepartments, setSelectedDeparments] = useState<Array<Department>>([])
    const [selectedTerms, setSelectedTerms] = useState<Array<Term>>([])

    const [courses, setCourses] = useState<Array<Course>>([])

    const [error, setError] = useState<Error | null>(null)

    //TODO: synchronize finish
    useEffect(() => {
        httpsCallable<any, Array<School>>(firebaseFunctions, "getSchools")({})
            .then(result => {
                const schools = result.data

                const getDepartments = httpsCallable<any, Array<Department>>(firebaseFunctions, "getDepartments")
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

        httpsCallable<any, Array<Term>>(firebaseFunctions, "getTerms")({})
            .then(result => setTerms(result.data))
            .catch(setError)
    }, [])

    const searchCourses = () => {
        httpsCallable<any, Array<Course>>(firebaseFunctions, "searchCourses")({
            terms: selectedTerms.map(term => term.Name),
            schools: selectedSchools.map(school => school.Name),
            departments: selectedDepartments.map(department => department.DepartmentName)
        })
            .then(result => setCourses(result.data))
            .catch(setError)
    }

    return (
        <div>
            {error && <APIError error={error} />}
            {loading ? <p>Loading</p> :
                <div>
                    <Select isMulti
                        options={schools.map(school => ({ value: school, label: school.Name }))}
                        onChange={selection => setSelectedSchools(selection.map(selection => selection.value))}
                    />
                    <Select isMulti options={schools
                        .flatMap(school => school.Departments
                            .map(department => ({ value: department, label: department.DepartmentName }))
                        )}
                        onChange={selection => setSelectedDeparments(selection.map(selection => selection.value))}
                    />
                    <Select isMulti
                        options={terms.map(term => ({ value: term, label: term.Name }))}
                        onChange={selection => setSelectedTerms(selection.map(selection => selection.value))}
                    />
                    <button onClick={searchCourses}>Search Courses</button>
                    {courses.length > 0 && <div className='ag-theme-quartz'><AgGridReact<Course>
                        rowData={courses}
                        columnDefs={[{ headerName: "Name", field: "Title" }]} /></div>}
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