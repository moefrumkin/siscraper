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
} from "./sisAPI";
import { isCourseQuery, isTermedCourseDetailsQuery, isCourseDetailsQuery } from "siscraper-shared";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getSchools = onCall((_) => {
  const data = requestSchools()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.error(error);
      throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
    });

  return data;
});

export const getDepartments = onCall((context) => {
  const school = context.data.school;

  const departments = requestDepartments(school)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.error(error);
      throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
    });

  return departments;
});

export const getTerms = onCall((_) => {
  const terms = requestTerms()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.error(error);
      throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
    });

  return terms;
});

export const searchCourses = onCall((context) => {
  const query = context.data;

  if (!isCourseQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed search request");
  }

  if (query.departments.length == 0 && query.schools.length == 0) {
    const courses = queryCourses(query)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        logger.error(error);
        throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
      });

    return courses;
  } else {
    const courses = Promise.all([
      query.schools.map((school) => queryCourses({
        terms: query.terms, schools: [school], departments: [],
      })),
      query.departments.map((department) => queryCourses({
        terms: query.terms, schools: [], departments: [department],
      }))].flat()).then((result) => {
      return result.flat(1);
    })
      .catch((error) => {
        logger.error(error);
        throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
      });
    return courses;
  }
});

export const getCourseDetails = onCall((context) => {
  const query = context.data;

  if (!isTermedCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  const details = requestCourseDetails(query)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.error(error);
      throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
    });

  return details;
});


export const getCourseSections = onCall((context) => {
  const query = context.data;

  if (!isCourseDetailsQuery(query)) {
    logger.error(`Malformed search request: ${query}`);
    throw new HttpsError("invalid-argument", "Malformed Search Request");
  }

  const details = requestCourseSections(query)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.error(error);
      throw new HttpsError("internal", `An Internal Error Occured: ${error}`);
    });

  return details;
});
