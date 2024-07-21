import { formatCourseQuery } from "../sisAPI"

test("Formats empty query", () => {
    const emptyQuery = {terms: [], schools: [], departments: []}
    expect(formatCourseQuery(emptyQuery)).toBe('')
})

test("Format school query", () => {
    const ksasQuery = {
        terms: [],
        schools: ["Krieger School of Arts and Sciences"],
        departments: []
    }

    expect(formatCourseQuery(ksasQuery)).toBe('School=Krieger School of Arts and Sciences')
})

test("Format term and school", () => {
    const query = {
        terms: ["Fall 2010"],
        schools: ["Carey Business School"],
        departments: []
    }

    expect(formatCourseQuery(query)).toBe('Term=Fall 2010&School=Carey Business School')
})

test("Format Complex", () => {
    const query = {
        terms: ["Fall 2020", "Spring 2021"],
        schools: ["Whiting School of Engineering"],
        departments: ["AS Near Eastern Studies"]
    }

    expect(formatCourseQuery(query)).toBe("Term=Fall 2020&Term=Spring 2021&School=Whiting School of Engineering&Department=AS Near Eastern Studies")
})