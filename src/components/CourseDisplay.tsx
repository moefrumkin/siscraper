import { Box, Card, CardActionArea, CardContent, ImageList, ImageListItem, Typography } from "@mui/material";
import { Course, Labeled, Term } from "../lib/datatypes";
import { BarChart, PieChart } from "@mui/x-charts";
import { useEffect, useMemo, useState } from "react";
import { getCourseDetails, getCourseSections } from "../firebase";
import { Loading } from "./Loading";
import { APIError } from "./APIError";
import Select from "react-select";

export const CourseDisplay = ({courseNumber, courseSection, term, terms}: {courseNumber: string, courseSection: string, term: Term, terms: Term[]}) => {
  const [loading, setLoading] = useState<boolean>(true)

  const [course, setCourse] = useState<Course | null>()

  const [sections, setSections] = useState<Course[]>([])

  const sectionDetails = useMemo(() => course?.SectionDetails[0], [course?.SectionDetails])

  const [error, setError] = useState<Error | null>(null);

  const [selectedCourseSection, setSelectedCourseSection] = useState<string>(courseSection);

  const [selectedTerm, setSelectedTerm] = useState<Term>(term);

  const sectionsForSelectedTerm = useMemo(() => sections.filter(section => section.Term == selectedTerm.Name), [sections, selectedTerm])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCourseDetails({courseNumber: courseNumber, sectionNumber: selectedCourseSection, term: selectedTerm.Name})
      .then((result) => setCourse(result.data[0]))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [courseNumber, selectedCourseSection, selectedTerm])

  useEffect(() => {
    getCourseSections({courseNumber: courseNumber, sectionNumber: courseSection})
      .then((result) => {setSections(result.data); console.log(result); })
      .catch(setError)
  }, [courseNumber, courseSection])

  return (
    <Box>
      {loading?
        <Loading/>:
        <>
          {error && <APIError error={error}/>}
          {course &&
        <>
          <Typography component="h1">{course.Title} ({course.OfferingName})</Typography>
          <Typography component="h1">Section: {course.SectionName} out of {sectionsForSelectedTerm.length}</Typography>
          <Typography component="h2">{course.Department}</Typography>
          <Typography component="h2">{course.Instructors}</Typography>
          <Typography component="h2">{course.Term}</Typography>
          {sectionDetails &&
        <>
          <Typography component="p">{sectionDetails.Description}</Typography>
        </>
          }
        </>}
          <Box>
            <Typography>Course Demand</Typography>
            <Select<Labeled<Term>>
              defaultValue={{label: selectedTerm.Name, value: selectedTerm}}
              options={terms.map(term => ({value: term, label: term.Name}))}
              onChange={selection => selection && setSelectedTerm(selection.value)}
            />
            <ImageList cols={1} sx={{gridAutoFlow: "column"}}>
              {sectionsForSelectedTerm.map(section => (
                <ImageListItem>
                  <Card>
                    <CardActionArea onClick={() => setSelectedCourseSection(section.SectionName)}>
                      <CardContent>
                        <SectionDemand course={section}/>
                        <Typography>{section.SectionName}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ImageListItem>
              ))}
            </ImageList>
            <CourseHistory sections={sections}/>
          </Box>
        </>}
    </Box>)
}

const SectionDemand = ({course}: {course: Course}) => {
  const openSeats = parseInt(course.OpenSeats);
  const filledSeats = parseInt(course.MaxSeats) - openSeats;

  return <PieChart
    series={[
      {
        data: [
          {id: 0, value: openSeats, label: `Open Seats (${openSeats})`, color: "green"},
          {id: 1, value: filledSeats, label: `Filled Seats (${filledSeats})`, color: "red"}
        ]
      }
    ]}
    width={600}
    height={200}
  />
}

const CourseHistory = ({sections}: {sections: Course[]}) => {
  const terms = useMemo(() => sections.map(course => course.Term), [sections])

  //TODO: there must be a more efficient way to do this
  const series = useMemo(() => [{label: "Enrollment", data: terms.map(term => sections.filter(course => course.Term == term).map(course => parseInt(course.MaxSeats) - parseInt(course.OpenSeats)).reduce((prev, curr) => prev + curr))}, 
    {label: "Waitlist", data: terms.map(term => sections.filter(course => course.Term == term).map(course => parseInt(course.Waitlisted)).reduce((prev, curr) => prev + curr))}], [terms, sections])

  return (
    <BarChart
      series= {series}
      xAxis={[{data: terms, scaleType: "band"}]}
      height={290}
    />
  )
}