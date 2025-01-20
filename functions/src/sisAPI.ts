import axios from "axios";
import {defineString} from "firebase-functions/params";
import {
  CourseDetailsQuery,
  CourseQuery,
  TermedCourseDetailsQuery,
  Department,
} from "siscraper-shared";

/**
 * The SIS API secret key.
 */
const APIKey = defineString("SIS_API_KEY");

/**
 * The the base URL for all API requests to the SIS API. 
 */
const APIBase = "https://sis.jhu.edu/api/classes";

/**
 * Creates a function that requests data from an enpoint determined by provided input
 * Prepends the API base and appends the API Key
 * @param formatter a function that formats the input as an API key
 * @return {any} a functions that formats input and makes an API request to the formatted address
 * using the formatter to process the input
 */
const request = <T>(formatter: ((arg: T) => string)) => (arg: T) =>
  axios.get(`${APIBase}/${formatter(arg)}?key=${APIKey.value()}`)
    .then((response) => response.data);

/**
 * Creates a function that makes an API call at a fixed endpoint 
 * @param route the API endpoint to make a request to
 * @returns A function that makes a request at the given endpoint
 */
const requestString = (route: string) => request<void>(() => route);

/**
 * Request a list of school from the SIS API
 */
export const requestSchools = requestString("codes/schools");

/**
 * Request a list of departments from the SIS API within a given school.
 * @param school 
 */
export const requestDepartments =
  request((school: string) => `codes/departments/${school}`);

/**
 * Request a list of terms from the SIS API
 */
export const requestTerms = requestString("codes/terms");

/**
 * Formats a course query as an api call string. Does not append the initial path
 * @param query The course query to format
 * @returns A formatted query to be appended to the end of a API search request
 */
export const formatCourseQuery = (query: CourseQuery) => (
  [query.terms.map((term: string) => `Term=${term}`).join("&"),
    query.schools.map((school: string) => `School=${school}`).join("&"),
    query.departments.map((department: Department) => (
      `School=${department.SchoolName}\
        &Department=${department.DepartmentName}`
    )).join("&"),
    (query.title == undefined? "": `CourseTitle=${query.title}`)
  ].
    filter((term) => term.length != 0)
    .join("&")
);

/**
 * Calls the SIS API and searches courses
 * @param query The query defining the search
 * @returns A promise with the courses
 */
export const queryCourses = (query: CourseQuery) =>
  axios.get(`${APIBase}?${formatCourseQuery(query)}&key=${APIKey.value()}`)
    .then((response) => response.data);

/**
 * Formats a requests for a detailed description of courses 
 * @param query The query detailing the course, term, and section
 * @returns A promise with the courses 
 */
const formatCourseDetailsRequest = (query: TermedCourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  `${query.sectionNumber}` +
  `${encodeURI(query.term)}`;

/**
 * Calls the SIS API and requests a detailed description of a course
 * @param query a query detailing the course, term, and section
 * @returns A promise with the course details
 */
export const requestCourseDetails = request(formatCourseDetailsRequest);

/**
 * Formats a request for a details description of courses in a semester 
 * @param query The query
 * @returns A formatted string
 */
const formatCourseSectionsQuery = (query: CourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  (query.term ? `${encodeURI(query.term)}` : "");

/**
 * Calls the SIS API and requests a detailed description of all section of a course offered
 * @param query a query detailing the course and term
 * @returns A promise with the courses
 */
export const requestCourseSections = request(formatCourseSectionsQuery);
