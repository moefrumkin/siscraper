import axios from "axios";
import {defineString} from "firebase-functions/params";
import {CourseDetailsQuery, CourseQuery} from ".";

const APIKey = defineString("SIS_API_KEY");
const APIBase = "https://sis.jhu.edu/api/classes";

export type School ={
    Name: string
}

export const isSearchContext = (query: object): query is CourseQuery => {
  const isArrayOfString = (arr: unknown): arr is Array<string> => (
    Array.isArray(arr) && arr.every((el) => typeof el === "string")
  );

  return "terms" in query &&
        isArrayOfString(query.terms) &&
        "schools" in query &&
        isArrayOfString(query.schools) &&
        "departments" in query &&
        isArrayOfString(query.departments);
};

export const requestSchools = () =>
  axios.get(`${APIBase}/codes/schools?key=${APIKey.value()}`)
    .then((response) => response.data);

export const requestDepartments = (school: string) =>
  axios.get(`${APIBase}/codes/departments/${school}?key=${APIKey.value()}`)
    .then((response) => response.data);

export const requestTerms = () =>
  axios.get(`${APIBase}/codes/terms?key=${APIKey.value()}`)
    .then((response) => response.data);

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

export const queryCourses = (query: CourseQuery) =>
  axios
    .get(`${APIBase}?${encodeURI(formatCourseQuery(query))}\
    &key=${APIKey.value()}`)
    .then((response) => response.data);

export const requestCourseDetails = (query: CourseDetailsQuery) =>
  axios
    .get(`${APIBase}/${query.courseNumber.replace(/\./g, "")}` +
    `${query.sectionNumber}/` +
    `${encodeURI(query.term)}?key=${APIKey.value()}`)
    .then((response) => response.data);


export const requestCourseSections = (query: CourseDetailsQuery) =>
  axios
    .get(`${APIBase}/${query.courseNumber.replace(/\./g, "")}` +
        `/${encodeURI(query.term)}?key=${APIKey.value()}`)
    .then((response) => response.data);

// TODO: add a data extraction function
