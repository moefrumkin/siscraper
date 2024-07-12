import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';

type School = {
    Name: string
    Departments: Array<Department>
}

type Department = any

const SISState = () => {
    const [loading, setLoading] = useState<Boolean>(true)
    const [schools, setSchools] = useState<Array<School>>()
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        httpsCallable<any, Array<School>>(firebaseFunctions, "getSchools")({})
            .then(result => {
                const schools = result.data

                const getDepartments = httpsCallable<any, Department>(firebaseFunctions, "getDepartments")
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
    }, [])

    return (
        <div>
            {error && <APIError error={error} />}
            {loading ? <p>Loading</p> :
                <p>{JSON.stringify(schools)}</p>}
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