/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {HttpsError, onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  queryCourses,
  requestCourseDetails,
  requestCourseSections,
  requestDepartments,
  requestSchools,
  requestTerms,
  // We need to have the .js extension for the typescript compiler
  // Otherwise, the compiled code would not properly link the module
} from "./sisAPI.js";

import {
  isCourseQuery,
  isTermedCourseDetailsQuery,
  isCourseDetailsQuery,
  Department} from "siscraper-shared";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * General error handling function. Logs and error and sends it to the client.
 * @param {Error} error The error to be logged and sent to the client
 */
const handleInternalError = (error: Error) => {
  logger.log(error);
  throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
};

/**
 * Sends the client a list of schools
 */
export const getSchools = onCall((_) =>
  requestSchools().catch(handleInternalError)
);

/**
 * Sends the client a list of departments within a given school
 */
export const getDepartments = onCall((context) => {
  const school = context.data.school;

  return requestDepartments(school)
    .catch(handleInternalError);
});

/**
 * Sends the client a list of terms
 */
export const getTerms = onCall((_) =>
  requestTerms().catch(handleInternalError)
);

/**
 * Sends the client a list of courses that satisfy the search query
 */
export const searchCourses = onCall((context) => {
  const query = context.data;

  if (!isCourseQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed search request");
  }

  // This handles course queries that do not specify departments
  if (query.departments.length == 0 && query.schools.length == 0) {
    return queryCourses(query)
      .catch(handleInternalError);
  } else {
    // Break up the query into separate queries for each school and department
    return Promise.all([
      query.schools.map((school: string) => queryCourses({
        terms: query.terms, schools: [school], departments: [],
        title: query?.title || undefined,
      })),
      query.departments.map((department: Department) => queryCourses({
        terms: query.terms, schools: [], departments: [department],
        title: query?.title || undefined,
      }))].flat()).then((result) => {
      return result.flat(1);
    }).catch(handleInternalError);
  }
});

/**
 * Sends the client a detailed description of a course
 */
export const getCourseDetails = onCall((context) => {
  const query = context.data;

  if (!isTermedCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  return requestCourseDetails(query)
    .catch(handleInternalError);
});

/**
 * Sends the client detailed descriptions of each section of a course
 */
export const getCourseSections = onCall((context) => {
  const query = context.data;

  if (!isCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  return requestCourseSections(query)
    .catch(handleInternalError);
});
