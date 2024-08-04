import { Box, Card, CardActionArea, CardContent, ImageList, ImageListItem, Typography } from "@mui/material";
import { Course } from "../lib/datatypes";
import { PieChart } from "@mui/x-charts";
import { useEffect, useMemo, useState } from "react";
import { getCourseDetails, getCourseSections } from "../firebase";
import { Loading } from "./Loading";
import { APIError } from "./APIError";

export const CourseDisplay = ({courseNumber, courseSection, term, onSectionClicked = () => {}}: {courseNumber: string, courseSection: string, term: string, onSectionClicked?: ((course: Course) => unknown)}) => {
    const [loading, setLoading] = useState<boolean>(true)

    const [course, setCourse] = useState<Course | null>()

    const [sections, setSections] = useState<Course[]>([])

    const sectionDetails = useMemo(() => course?.SectionDetails[0], [course?.SectionDetails])

    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true)
        setError(null)
        getCourseDetails({courseNumber: courseNumber, sectionNumber: courseSection, term: term})
        .then((result) => setCourse(result.data[0]))
        .catch(setError)
        .finally(() => setLoading(false))
    }, [courseNumber, courseSection, term])

    useEffect(() => {
        getCourseSections({courseNumber: courseNumber, sectionNumber: courseSection, term: term})
        .then((result) => {setSections(result.data); console.log(result);})
        .catch(setError)
    }, [courseNumber, courseSection, term])

    return (
    <Box>
        {loading?
        <Loading/>:
        <>
        {error && <APIError error={error}/>}
        {course &&
        <>
        <Typography component="h1">{course.Title} ({course.OfferingName})</Typography>
        <Typography component="h1">Section: {course.SectionName} out of {sections.length}</Typography>
        <Typography component="h2">{course.Department}</Typography>
        <Typography component="h2">{course.Instructors}</Typography>
        {sectionDetails &&
        <>
        <Typography component="p">{sectionDetails.Description}</Typography>
        </>
        }
        <Box>
            <Typography>Course Demand</Typography>
            <ImageList cols={1} sx={{gridAutoFlow: "column"}}>
                {sections.map(section => (
                    <ImageListItem>
                    <Card>
                        <CardActionArea onClick={() => onSectionClicked(section)}>
                            <CardContent>
                                <SectionDemand course={section}/>
                                <Typography>{section.SectionName}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
        </>}</>}
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