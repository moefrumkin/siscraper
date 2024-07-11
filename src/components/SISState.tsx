import axios from 'axios';
import { error } from 'effect/Brand';
import React, { useEffect, useState } from 'react';

const SISState = (props: { APIKey: string }) => {
    const [loading, setLoading] = useState<Boolean>(true)
    const [data, setData] = useState<JSON>()
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        axios.get(`https://sis.jhu.edu/api/classes/codes/schools?key=${props.APIKey}`)
            .then(response => setData(response.data))
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