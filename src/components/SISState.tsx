import { useEffect, useState } from 'react';
import { firebaseFunctions } from '../firebase'
import { httpsCallable } from 'firebase/functions';

const SISState = () => {
    const [loading, setLoading] = useState<Boolean>(true)
    const [data, setData] = useState<JSON>()
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        httpsCallable(firebaseFunctions, "getSchools")({})
            .then(res => console.log(res))
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])


    return (
        <div>
            {error && <APIError error={error} />}
            {loading ? <p>Loading</p> :
                <p>{JSON.stringify(data)}</p>}
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