import axios from "axios";
import {defineString} from "firebase-functions/params";
import { CourseDetailsQuery, CourseQuery, TermedCourseDetailsQuery } from "siscraper-shared";

const APIKey = defineString("SIS_API_KEY");
const APIBase = "https://sis.jhu.edu/api/classes";


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

export const requestCourseDetails =
(query: TermedCourseDetailsQuery) =>
  axios
    .get(`${APIBase}/${query.courseNumber.replace(/\./g, "")}` +
    `${query.sectionNumber}/` +
    `${encodeURI(query.term)}?key=${APIKey.value()}`)
    .then((response) => response.data);


export const requestCourseSections = (query: CourseDetailsQuery) => {
  const termTerm = query.term? `/${encodeURI(query.term)}` : "";

  return axios
    .get(`${APIBase}/${query.courseNumber.replace(/\./g, "")}` +
        termTerm +
        `?key=${APIKey.value()}`)
    .then((response) => response.data);
};

// TODO: add a data extraction function
