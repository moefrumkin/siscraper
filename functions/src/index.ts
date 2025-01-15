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
  School, Department} from "siscraper-shared";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const handleInternalError = (error: Error) => {
  logger.log(error);
  throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
};

export const getSchools = onCall((_) =>
  requestSchools().catch(handleInternalError)
);

export const getDepartments = onCall((context) => {
  const school = context.data.school;

  return requestDepartments(school)
    .catch(handleInternalError);
});

export const getTerms = onCall((_) =>
  requestTerms().catch(handleInternalError)
);

export const searchCourses = onCall((context) => {
  const query = context.data;

  if (!isCourseQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed search request");
  }

  if (query.departments.length == 0 && query.schools.length == 0) {
    return queryCourses(query)
      .catch(handleInternalError);
  } else {
    return Promise.all([
      query.schools.map((school: string) => queryCourses({
        terms: query.terms, schools: [school], departments: [],
      })),
      query.departments.map((department: Department) => queryCourses({
        terms: query.terms, schools: [], departments: [department],
      }))].flat()).then((result) => {
      return result.flat(1);
    }).catch(handleInternalError);
  }
});

export const getCourseDetails = onCall((context) => {
  const query = context.data;

  if (!isTermedCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  return requestCourseDetails(query)
    .catch(handleInternalError);
});


export const getCourseSections = onCall((context) => {
  const query = context.data;

  if (!isCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  return requestCourseSections(query)
    .catch(handleInternalError);
});
