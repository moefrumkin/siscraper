import { Box, Card, CardActionArea, CardContent, ImageList, ImageListItem, Typography } from "@mui/material";
import { Course } from "../lib/datatypes";
import { PieChart } from "@mui/x-charts";
import { useEffect, useMemo, useState } from "react";
import { getCourseDetails } from "../firebase";
import { Loading } from "./Loading";
import { APIError } from "./APIError";

export const CourseDisplay = ({course, sections, onSectionClicked = () => {}}: {course: Course, sections: Course[], onSectionClicked?: ((course: Course) => unknown)}) => {
    const [loading, setLoading] = useState<boolean>(false)

    const [detailedCourse, setDetailedCourse] = useState<Course | null>()

    const sectionDetails = useMemo(() => detailedCourse?.SectionDetails[0], [detailedCourse])

    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true)
        setError(null)
        getCourseDetails({courseNumber: course.OfferingName, sectionNumber: course.SectionName, term: course.Term})
        .then((result) => setDetailedCourse(result.data[0]))
        .catch(setError)
        .finally(() => setLoading(false))
    }, [course])

    return (
    <Box>
        {loading?
        <Loading/>:
        <>
        {error && <APIError error={error}/>}
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