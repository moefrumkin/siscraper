/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import axios from "axios";
import { defineString } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { isSearchContext } from 'siscraper-shared'

const APIKey = defineString('SIS_API_KEY');
const APIBase = "https://sis.jhu.edu/api/classes"

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getSchools = onCall({}, (_) => {
    const data = axios.get(`${APIBase}/codes/schools?key=${APIKey.value()}`)
        .then(result => { return result.data })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return data;
})

export const getDepartments = onCall({}, (context) => {
    const school = context.data.school;

    const departments = axios.get(`${APIBase}/codes/departments/${school}?key=${APIKey.value()}`)
        .then(result => { return result.data })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return departments;
})

export const getTerms = onCall({}, (_) => {
    const terms = axios.get(`${APIBase}/codes/terms?key=${APIKey.value()}`)
        .then(result => { return result.data })
        .catch(error => {
            logger.error(error);
            throw new HttpsError('internal', `An Internal Error Occured: ${error}`)
        })

    return terms;
})

export const searchCourses = onCall({}, (context) => {
    const config = context.data;

    if (!isSearchContext(config)) {
        throw new HttpsError('invalid-argument', `Malformed Search Configuration: ${JSON.stringify(config)}`)
    }
})