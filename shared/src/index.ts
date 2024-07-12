export type School = {
    Name: string
    Departments: Array<Department>
}

export type Department = {
    DepartmentName: string
    SchoolName: string
}

export type Term = {
    Name: string
}

export type Course = any

export type SearchContext = {
    terms: Array<string>,
    schools: Array<string>,
    departments: Array<string>
}

export const isSearchContext = (context: any): context is SearchContext => {
    const isArrayOfString = (arr: any): arr is Array<string> => (
        Array.isArray(arr) && arr.every(el => typeof el === "string")
    )

    return isArrayOfString(context.terms) && isArrayOfString(context.schools) && isArrayOfString(context.departments)
}