import { useEffect, useState } from "react";
import { getDepartments, getSchools, getTerms, searchCourses } from "../firebase"
import Select, { CSSObjectWithLabel, GroupBase } from "react-select"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"
import { School, Term, Department, Course, ColumnMeta, DefaultColumns, CourseHeader, Labeled } from "siscraper-shared";
import { Loading } from "./Loading";
import { Button, Container, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { CourseDisplay } from "./CourseDisplay";
import { APIError } from "./APIError";
import { CourseTable } from "./CourseTable";

const SISState = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [schools, setSchools] = useState<Array<School>>([])
  const [terms, setTerms] = useState<Array<Term>>([])

  const [selectedSchools, setSelectedSchools] = useState<Array<School>>([])
  const [selectedDepartments, setSelectedDeparments] = useState<Array<Department>>([])
  const [selectedTerms, setSelectedTerms] = useState<Array<Term>>([])

  const [courses, setCourses] = useState<Array<Course>>([])

  const [headers, setHeaders] = useState<ColumnMeta[]>(DefaultColumns)

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setError(null)
    const promisedSchools = getSchools()
      .then(result => {
        const schools = result.data

               
        return Promise.all(schools.map(school =>
          getDepartments({ school: school.Name }).then(departments => {
            return {
              Name: school.Name,
              Departments: departments.data
            }
          })
        ))
      })
      .then(setSchools)

    const promisedTerms = getTerms()
      .then(result => setTerms(result.data))

    Promise.all([promisedSchools, promisedTerms])
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  const getCourses = () => {
    setError(null)
    setLoading(true)
    searchCourses({
      terms: selectedTerms.map(term => term.Name),
      schools: selectedSchools.map(school => school.Name),
      departments: selectedDepartments
    })
      .then(result => setCourses(result.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const menuStyle = {
    option: (provided: CSSObjectWithLabel, _: unknown) => ({
      ...provided,
      color: "#000000"
    }),
  }

  const selectContainerStyle = {
    width: "30%",
    textAlign: "center"
  }

  return (
    <div>
      {error && <APIError error={error} />}
      {loading ? <Loading/> :
        <div>
          <Container
            sx={selectContainerStyle}
          >
                      <Typography variant="h3">Search Courses:</Typography>
            <Stack
              spacing={1}
            >
              <Select isMulti
                styles={menuStyle}
                options={schools.map(school => ({ value: school, label: school.Name }))}
                onChange={selection => setSelectedSchools(selection.map(selection => selection.value))}
                value={selectedSchools.map(school => ({value: school, label: school.Name}))}
                placeholder="Schools..."
              />
              <Select<Labeled<Department>, true, Labeled<School> & { readonly options: readonly Labeled<Department>[] }> 
                isMulti
                styles={menuStyle}

                options={schools
                  .filter(school => !selectedSchools.includes(school))
                  .map(school => ({
                    value: school,
                    label: school.Name,
                    options: school.Departments.map(department => ({ value: department, label: department.DepartmentName }))
                  }))}
                onChange={selection => setSelectedDeparments(selection.map(selection => selection.value))}
                formatGroupLabel={school => (
                  <div>
                    <span>{school.label}</span>
                  </div>
                )}
                value={selectedDepartments.map(department => ({value: department, label: department.DepartmentName}))}
                placeholder="Departments..."
              />
              <Select isMulti
                styles={menuStyle}
                options={terms.map(term => ({ value: term, label: term.Name }))}
                onChange={selection => setSelectedTerms(selection.map(selection => selection.value))}
                value={selectedTerms.map(term => ({value: term, label: term.Name}))}
                placeholder="Terms..."
              />
            </Stack>
 
            <Button onClick={getCourses}>Search</Button>
            <Button onClick={() => {setCourses([]); setError(null)}}>Clear</Button>

          </Container>



          {courses.length > 0 &&
                      <Container className='ag-theme-quartz' sx={{ height: "50em", width: "90%" }}>
              <Select<Labeled<ColumnMeta>, true, GroupBase<Labeled<ColumnMeta>>>
                isMulti
                styles={menuStyle}
                options={Object.values(CourseHeader).map(header => ({value: header, label: header.readableName}))}
                defaultValue={DefaultColumns.map(column => ({value: column, label: column.readableName}))}
                onChange={selection => setHeaders(selection.map(column => column.value))}
              />
              <CourseTable courses={courses} headers={headers} onCourseSelected={setSelectedCourse}/>
            </Container>
          }
        </div>}
      <Dialog
        open={selectedCourse != null}
        onClose={() => setSelectedCourse(null)}
        fullWidth
        scroll="paper"
      >
        <DialogTitle>{selectedCourse?.OfferingName}: {selectedCourse?.Title}</DialogTitle>
        <DialogContent
          style={{height: "80vh"}}
          dividers={true}
        >
          {selectedCourse !== null && <CourseDisplay courseNumber={selectedCourse.OfferingName} courseSection={selectedCourse.SectionName} term={{Name: selectedCourse.Term}} terms={terms}/>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SISState