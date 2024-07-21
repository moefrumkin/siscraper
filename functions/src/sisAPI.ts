import axios from "axios";
import { defineString } from "firebase-functions/params";

const APIKey = defineString('SIS_API_KEY');
const APIBase = "https://sis.jhu.edu/api/classes"

export type School = {
    Name: string
}

export type CourseQuery = {
    terms: Array<string>,
    schools: Array<string>,
    departments: Array<string>
}

export const isSearchContext = (query: any): query is CourseQuery => {
    const isArrayOfString = (arr: any): arr is Array<string> => (
        Array.isArray(arr) && arr.every(el => typeof el === "string")
    )

    return isArrayOfString(query.terms) && isArrayOfString(query.schools) && isArrayOfString(query.departments)
}

export const requestSchools = () => axios.get(`${APIBase}/codes/schools?key=${APIKey.value()}`).then(response => response.data)
export const requestDepartments = (school: string) => axios.get(`${APIBase}/codes/departments/${school}?key=${APIKey.value()}`).then(response => response.data)
export const requestTerms = () => axios.get(`${APIBase}/codes/terms?key=${APIKey.value()}`).then(response => response.data)

export const formatCourseQuery = (query:  CourseQuery) => (
    [query.terms.map(term => `Term=${term}`).join("&"),
    query.schools.map(school => `School=${school}`).join("&"),
    query.departments.map(department => `Department=${department}`).join("&")]
    .filter(term => term.length != 0)
    .join("&")
)