/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import axios from "axios";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { requestDepartments, requestSchools, requestTerms } from "./sisAPI";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getSchools = onCall({}, (_) => {
    const data = requestSchools()
        .then(result => { return result })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return data;
})

export const getDepartments = onCall({}, (context) => {
    const school = context.data.school;

    const departments = requestDepartments(school)
        .then(result => { return result})
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return departments;
})

export const getTerms = onCall({}, (_) => {
    const terms = requestTerms()
        .then(result => { return result })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return terms;
})

export const searchCourses = onCall({}, context => {
    const request = context.data

    if (!isSearchContext(request)) {
        throw new HttpsError('invalid-argument', `Malformed search request`)
    }

    const query = `${request.terms.map(term => `Term=${term}`).join("&")}
    &${request.departments.map(department => `Department=${department}`).join("&")}
    &${request.schools.map(school => `School=${school}`).join("&")}`

    /*/onst courses = axios.get(encodeURI(`${APIBase}?key=${APIKey.value()}&${query}`))
        .then(result => { return result.data })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return courses; */
})

export type SearchContext = {
    terms: Array<string>,
    schools: Array<string>,
    departments: Array<string>
}

export const isSearchContext = (context: any): context is SearchContext => {
    const isArrayOfString = (arr: any): arr is Array<string> => (
        Array.isArray(arr) && arr.every(el => typeof el === "string")
    )

    return isArrayOfString(context.terms) && isArrayOfString(context.schools) && isArrayOfString(context.departments)
}