import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';
import Select from 'react-select'
import { Course, Department, School, Term } from 'siscraper-shared';

const SISState = () => {
    const [loading, setLoading] = useState<Boolean>(true)
    const [schools, setSchools] = useState<Array<School>>([])
    const [terms, setTerms] = useState<Array<Term>>([])

    const [selectedSchools, setSelectedSchools] = useState<Array<School>>([])
    const [selectedDepartments, setSelectedDeparments] = useState<Array<Department>>([])
    const [selectedTerms, setSelectedTerms] = useState<Array<Term>>([])

    const [course, setCourses] = useState<Array<Course>>([])

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

    const searchClasses = () => {
        httpsCallable<any, Array<Course>>(firebaseFunctions, "searchCourses")({
            terms: selectedTerms,
            schools: selectedSchools,
            departments: selectedDepartments
        }).then(result => setCourses(result.data))
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
                    <button onClick={searchClasses}>Search Courses</button>
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