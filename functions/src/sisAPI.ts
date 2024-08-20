import axios from "axios";
import {defineString} from "firebase-functions/params";
import { CourseDetailsQuery, CourseQuery, TermedCourseDetailsQuery } from "siscraper-shared";

const APIKey = defineString("SIS_API_KEY");
const APIBase = "https://sis.jhu.edu/api/classes";

/**
 * Creates a function that requests data from an enpoint.
 * Prepends the API base and appends the API Key
 * @param formatter
 * @returns 
 */
const request = <T>(formatter: ((arg: T) => string)) => (arg: T) =>
  axios.get(`${APIBase}/${formatter(arg)}?key=${APIKey.value()}`)
    .then((response) => response.data);

const requestString = (route: string) => request<void>(() => route)

export const requestSchools = requestString("codes/schools")

export const requestDepartments =
  request((school: string) => `codes/departments/${school}`)

export const requestTerms = requestString(`codes/terms`)

export const formatCourseQuery = (query: CourseQuery) => (
  [query.terms.map((term) => `Term=${term}`).join("&"),
    query.schools.map((school) => `School=${school}`).join("&"),
    query.departments.map((department) => (
      `School=${department.SchoolName}\
        &Department=${department.DepartmentName}`
    )).join("&")].
    filter((term) => term.length != 0)
    .join("&")
);

export const queryCourses = request((query: CourseQuery) =>
  encodeURI(formatCourseQuery(query))
)

const formatCourseDetailsRequest = (query: TermedCourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  `${query.sectionNumber}` +
  `${encodeURI(query.term)}`

export const requestCourseDetails = request(formatCourseDetailsRequest)

const formatCourseSectionsQuery = (query: CourseDetailsQuery) =>
  `${query.courseNumber.replace(/\./g, "")}` +
  (query.term ? `${encodeURI(query.term)}` : "")

export const requestCourseSections = request(formatCourseSectionsQuery)