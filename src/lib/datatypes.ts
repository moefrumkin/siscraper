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
    TermStartDate: string,
    SchoolName: string,
    CoursePrefix: string,
    Term: string,
    Term_IDR: string,
    OfferingName: string,
    SectionName: string,
    Title: string,
    Credits: string,
    Department: string,
    Level: string,
    Status: string,
    DOW: string,
    DOWSort: string,
    TimeofDay: string,
    SubDepartment: string,
    SectionRegRestriction: string,
    Prerequisite: string,
    SeatsAvailable: string,
    MaxSeats: string,
    OpenSeats: string,
    Waitlisted: string,
    IsWritingIntensive: string,
    AllDepartments: string,
    Instructors: string,
    InstructorsFullName: string,
    Location: string,
    Building: string,
    HasBio: string,
    Meetings: string,
    Areas: string,
    InstructionMethod: string,
    SectionCoRequisites: string,
    SectionCoReqNotes: string,
    SSS_SectionsID: string,
    Term_JSS: string,
    Repeatable: string,
    SectionDetail: string
}

export type SearchQuery = {
    terms: string[],
    schools: string[],
    departments: Department[]
}

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
            {
                name: "Is Graduate",
                predicate: (course) => course.Level == "Graduate"
            },
            {
                name: "Lower Level Undergraduate",
                predicate: (course) => course.Level == "Lower Level Undergraduate"
            }
        ]
    },
    Status: {
        name: "Status",
        readableName: "Status"
    },
    DOW: {
        name: "DOW",
        readableName: "Days of Week"
    },
    DOWSort: {
        name: "DOWSort",
        readableName: "Days of Week for Sort"
    },
    TimeofDay: {
        name: "TimeofDay",
        readableName: "Does Instructor Have Bio"
    },
    SubDepartment: {
        name: "SubDepartment",
        readableName: "Subdepartment"
    },
    SectionRegRestriction: {
        name: "SectionRegRestriction",
        readableName: "Sections Registration Restriction"
    },
    Prerequisite: {
        name: "Prerequisite",
        readableName: "Prerequisites"
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
    SSS_SectionsID: {
        name: "SSS_SectionsID",
        readableName: "SSS_SectinsID"
    },
    Term_JSS: {
        name: "Term_JSS",
        readableName: "Term JSS"
    },
    Repeatable: {
        name: "Repeatable",
        readableName: "Repeatable"
    },
    SectionDetail: {
        name: "SectionDetail",
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