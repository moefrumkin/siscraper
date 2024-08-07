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

export type Meeting = {
    Building: string,
    DOW: string,
    Dates: string,
    Location: string,
    Room: string,
    Times: string
}

export type Prerequisite = {
    Description: string,
    Expression: string,
    IsNegative: string
}

export type SearchQuery = {
    terms: string[],
    schools: string[],
    departments: Department[]
}

export type CourseDetailsQuery = {
    courseNumber: string,
    sectionNumber: string,
    term?: string
}

export type TermedCourseDetailsQuery = CourseDetailsQuery & {term: string}

// A utility type for the react-select Select component
export type Labeled<T> =  {
    value: T,
    label: string
}

export type Predicate<T> = (instance: T) => boolean

export type Filter<T> = {
    predicate: Predicate<T>,
    name: string
}

const equals = <T>(value: T, field: keyof Course) => (course: Course) => course[field] === value

const equalsString = (value: string, field: keyof Course) => ({
    predicate: equals(value, field),
    name: value
})

export type ColumnMeta = {
    name: keyof Course,
    readableName: string,
    filters?: Filter<Course>[]
}

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