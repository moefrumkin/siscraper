/**
 * Represents a school
 */
export type School = {
    Name: string
    Departments: Array<Department>
}

/**
 * Represents a department within the school
 * This is in the format that the API will return
 */
export type Department = {
    DepartmentName: string
    SchoolName: string
};

/**
 * A type guard for the `Department` type
 * @param department The potential department
 * @returns A type predicate
 */
export const isDepartment = (department: unknown): department is Department => (
  Object.prototype.hasOwnProperty.call(department, "DepartmentName") &&
    Object.prototype.hasOwnProperty.call(department, "SchoolName")
)

/**
 * Represents a term
 */
export type Term = {
    Name: string
}

/**
 * Represents a course
 */
export type Course = {
    AllDepartments: string,
    Areas: string,
    Building: string,
    CoursePrefix: string,
    Credits: string,
    Department: string,
    DOW: string,
    DOWSort: string,
    HasBio: string,
    InstructionMethod: string,
    Instructors: string,
    InstructorsFullName: string,
    IsWritingIntensive: string,
    Level: string,
    Location: string,
    MaxSeats: string,
    Meetings: string,
    OfferingName: string,
    OpenSeats: string,
    Repeatable: string,
    SchoolName: string,
    SeatsAvailable: string,
    SectionCoReqNotes: string,
    SectionCoRequisites: string,
    SectionName: string,
    SectionRegRestrictions: string,
    Status: string,
    SectionDetails: SectionDetails[],
    SubDepartment: string,
    Term: string,
    Term_IDR: string,
    Term_JSS: string,
    TermStartDate: string,
    TimeOfDay: string,
    Title: string,
    Waitlisted: string,
}

/**
 * Represents a detailed description of a specific section of a course
 */
export type SectionDetails = {
    CoRequisites: string[],
    Credits: string,
    CreditType: string,
    Departments: string,
    DepartmentID: string,
    Description: string,
    EvaluationUrls: string[],
    Fees: string[],
    Meetings: Meeting[],
    PosTags: unknown,
    Prerequisites: unknown,
    WebNotes: string,
    Instructors: unknown,
    Equivalencies: unknown
}

/**
 * Represents an individual class meeting
 */
export type Meeting = {
    Building: string,
    DOW: string,
    Dates: string,
    Location: string,
    Room: string,
    Times: string
}

/**
 * Represents a prerequisite for a course
 */
export type Prerequisite = {
    Description: string,
    Expression: string,
    IsNegative: string
}

/**
 * Represents a search query for a course. All terms are unioned.
 */
export type SearchQuery = {
    terms: string[],
    schools: string[],
    departments: Department[]
}

/**
 * Similar to SearchQuery
 */
export type CourseQuery = {
    terms: Array<string>,
    schools: Array<string>,
    departments: Array<Department>
}

/**
 * A type guard for the `CourseQuery` type 
 * @param context the potential query
 * @returns a type predicate for `CourseQuery`
 */
export const isCourseQuery = (context: object): context is CourseQuery => {
  const isArrayOfString = (arr: unknown): arr is Array<string> => (
    Array.isArray(arr) && arr.every((el) => typeof el === "string")
  );

  return "terms" in context &&
        isArrayOfString(context.terms) &&
        "schools" in context &&
        isArrayOfString(context.schools) &&
        "departments" in context &&
        Array.isArray(context.departments) &&
        context.departments.every((dept: unknown) => isDepartment(dept));
};

/**
 * A general query for a detailed description of a course
 */
export type CourseDetailsQuery = {
    courseNumber: string,
    sectionNumber: string,
    term?: string
}

/**
 * A query for a detailed description of the course with a single term specified
 */
export type TermedCourseDetailsQuery = CourseDetailsQuery &
{ term: string }

/**
 * A type predicate for the `CourseDetailsQuery` type 
 * @param query the potential course query type
 * @returns A type predicate for `CourseDetailsQuery`
 */
export const isCourseDetailsQuery =
    (query: object): query is CourseDetailsQuery => (
      "courseNumber" in query &&
        typeof query.courseNumber === "string" &&
        "sectionNumber" in query &&
        typeof query.sectionNumber === "string"
    );

/**
 * A type predicate for the `TermedCourseDetailsQuery` type 
 * @param query the potential terms course query
 * @returns A type predicate for `TermedCourseDetailsQuery` 
 */
export const isTermedCourseDetailsQuery =
    (query: object): query is TermedCourseDetailsQuery => (
      isCourseDetailsQuery(query) &&
        "term" in query &&
        typeof query.term === "string"
    );


/**
 * A type that represents a tagged base type
 */
export type Labeled<T> = {
    value: T,
    label: string
}

/**
 * A function that returns a boolean, often indicating membership of some category
 */
export type Predicate<T> = (instance: T) => boolean

/**
 * A filter is a predicate, used to determine if a course has a certain property, and a name for the filter
 */
export type Filter<T> = {
    predicate: Predicate<T>,
    name: string
}

/**
 * Constructs a predicate that determines if a specific field has a given value 
 * @param value the value to determine if the field has 
 * @param field the field in the course 
 * @returns a `Predicate<T>` that determines whether the course has the given value
 */
const equals = <T>(value: T, field: keyof Course) => (course: Course) => course[field] === value

/**
 * Constructs a filter that determines if a given field has a specific string value 
 * @param value the string value to compare the field against
 * @param field the field to compare
 * @returns a `Filter<string>` that determines whether the course has the given string value.
 */
const equalsString = (value: string, field: keyof Course) => ({
  predicate: equals(value, field),
  name: value
})

/**
 * Metadata corresponding to a specific field in the `Course` object
 */
export type ColumnMeta = {
    name: keyof Course,
    readableName: string,
    filters?: Filter<Course>[]
}

/**
 * The list of fields in the `Course` object with corresponding metadata
 */
export const CourseHeader: { [key in (keyof Course)]: ColumnMeta } = {
  TermStartDate: {
    name: "TermStartDate",
    readableName: "Term Start Date"
  },
  SchoolName: {
    name: "SchoolName",
    readableName: "School Name"
  },
  CoursePrefix: {
    name: "CoursePrefix",
    readableName: "Course Prefix"
  },
  Term: {
    name: "Term",
    readableName: "Term"
  },
  Term_IDR: {
    name: "Term_IDR",
    readableName: "Term IDR"
  },
  OfferingName: {
    name: "OfferingName",
    readableName: "Offering Name"
  },
  SectionName: {
    name: "SectionName",
    readableName: "Section Name"
  },
  Title: {
    name: "Title",
    readableName: "Title"
  },
  Credits: {
    name: "Credits",
    readableName: "Credits"
  },
  Department: {
    name: "Department",
    readableName: "Department"
  },
  Level: {
    name: "Level",
    readableName: "Level",
    filters: [
      equalsString("Lower Level Undergraduate", "Level"),
      equalsString("Upper Level Undergraduate", "Level"),
      equalsString("Graduate", "Level"),
    ]
  },
  Status: {
    name: "Status",
    readableName: "Status",
    filters: [
      equalsString("Open", "Status"),
      equalsString("Closed", "Status"),
      equalsString("Canceled", "Status"),
      equalsString("Waitlist Only", "Status"),
      equalsString("Reserved Open", "Status"),
      equalsString("Approval Required", "Status")
    ]
  },
  DOW: {
    name: "DOW",
    readableName: "Days of Week"
  },
  DOWSort: {
    name: "DOWSort",
    readableName: "Days of Week for Sort"
  },
  TimeOfDay: {
    name: "TimeOfDay",
    readableName: "Does Instructor Have Bio"
  },
  SubDepartment: {
    name: "SubDepartment",
    readableName: "Subdepartment"
  },
  SectionRegRestrictions: {
    name: "SectionRegRestrictions",
    readableName: "Sections Registration Restriction"
  },
  SeatsAvailable: {
    name: "SeatsAvailable",
    readableName: "Seats Available"
  },
  MaxSeats: {
    name: "MaxSeats",
    readableName: "Maximum Seats"
  },
  OpenSeats: {
    name: "OpenSeats",
    readableName: "Open Seats"
  },
  Waitlisted: {
    name: "Waitlisted",
    readableName: "Waitlist Length"
  },
  IsWritingIntensive: {
    name: "IsWritingIntensive",
    readableName: "Writing Intensive"
  },
  AllDepartments: {
    name: "AllDepartments",
    readableName: "All Departments"
  },
  Instructors: {
    name: "Instructors",
    readableName: "Instructors"
  },
  InstructorsFullName: {
    name: "InstructorsFullName",
    readableName: "Instructors Full Name"
  },
  Location: {
    name: "Location",
    readableName: "Location"
  },
  Building: {
    name: "Building",
    readableName: "Building"
  },
  HasBio: {
    name: "HasBio",
    readableName: "Instructor Biography"
  },
  Meetings: {
    name: "Meetings",
    readableName: "Meetings"
  },
  Areas: {
    name: "Areas",
    readableName: "Areas"
  },
  InstructionMethod: {
    name: "InstructionMethod",
    readableName: "Instruction Method"
  },
  SectionCoRequisites: {
    name: "SectionCoRequisites",
    readableName: "Section Corequisites"
  },
  SectionCoReqNotes: {
    name: "SectionCoReqNotes",
    readableName: "Section Corequisite Notes"
  },
  Term_JSS: {
    name: "Term_JSS",
    readableName: "Term JSS"
  },
  Repeatable: {
    name: "Repeatable",
    readableName: "Repeatable"
  },
  SectionDetails: {
    name: "SectionDetails",
    readableName: "Section Detail"
  }
}

/**
 * A list of default columns to display
 */
export const DefaultColumns: ColumnMeta[] = [
  CourseHeader.SchoolName,
  CourseHeader.Term,
  CourseHeader.OfferingName,
  CourseHeader.SectionName,
  CourseHeader.Title,
  CourseHeader.Credits,
  CourseHeader.Department,
  CourseHeader.Level,
  CourseHeader.Status,
  CourseHeader.SeatsAvailable,
  CourseHeader.MaxSeats,
  CourseHeader.OpenSeats,
  CourseHeader.Waitlisted
]