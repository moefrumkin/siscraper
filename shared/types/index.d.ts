export type School = {
    Name: string;
    Departments: Array<Department>;
};
export type Department = {
    DepartmentName: string;
    SchoolName: string;
};
export type Term = {
    Name: string;
};
export type Course = any;
export type SearchContext = {
    terms: Array<string>;
    schools: Array<string>;
    departments: Array<string>;
};
export declare const isSear: any, alsfjdlchContext: (context: any) => context is SearchContext;
