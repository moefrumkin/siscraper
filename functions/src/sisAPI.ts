import axios from "axios";
import {defineString} from "firebase-functions/params";
import {
  CourseDetailsQuery,
  CourseQuery,
  TermedCourseDetailsQuery,
  Department,
} from "siscraper-shared";

const APIKey = defineString("SIS_API_KEY");
const APIBase = "https://sis.jhu.edu/api/classes";

/**
 * Creates a function that requests data from an enpoint.
 * Prepends the API base and appends the API Key
 * @param {T} formatter
 * @return {any} a functions that requests data from an endpoint,
 * using the formatter to process the input
 */
const request = <T>(formatter: ((arg: T) => string)) => (arg: T) =>
  axios.get(`${APIBase}/${formatter(arg)}?key=${APIKey.value()}`)
    .then((response) => response.data);

const requestString = (route: string) => request<void>(() => route);

export const requestSchools = requestString("codes/schools");

export const requestDepartments =
  request((school: string) => `codes/departments/${school}`);

export const requestTerms = requestString("codes/terms");

export const formatCourseQuery = (query: CourseQuery) => (
  [query.terms.map((term: string) => `Term=${term}`).join("&"),
    query.schools.map((school: string) => `School=${school}`).join("&"),
    query.departments.map((department: Department) => (
      `School=${department.SchoolName}\
        &Department=${department.DepartmentName}`
    )).join("&")].
    filter((term) => term.length != 0)
    .join("&")
);

export const queryCourses = (query: CourseQuery) =>
  axios.get(`${APIBase}?${formatCourseQuery(query)}&key=${APIKey.value()}`)
    .then((response) => response.data);

const formatCourseDetailsRequest = (query: TermedCourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  `${query.sectionNumber}` +
  `${encodeURI(query.term)}`;

export const requestCourseDetails = request(formatCourseDetailsRequest);

const formatCourseSectionsQuery = (query: CourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  (query.term ? `${encodeURI(query.term)}` : "");

export const requestCourseSections = request(formatCourseSectionsQuery);
