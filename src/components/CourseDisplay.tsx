import { Box, Typography } from "@mui/material";
import { Course } from "../lib/datatypes";
import { PieChart } from "@mui/x-charts";

export const CourseDisplay = ({course}: {course: Course}) => (
    <Box>
        <Typography component="h1">{course.Title} ({course.OfferingName})</Typography>
        <Typography component="h2">{course.Department}</Typography>
        <Typography component="h2">{course.Instructors}</Typography>
        <Box>
            <Typography>Course Demand</Typography>
            <PieChart
                series={[
                    {
                        data: [
                            {id: 0, value: parseInt(course.OpenSeats), label: "Open Seats", color: "green"},
                            {id: 1, value: parseInt(course.MaxSeats) - parseInt(course.OpenSeats), label: "Filled Seats", color: "red"}
                        ]
                    }
                ]}
                width={400}
                height={200}
                />
        </Box>
    </Box>
)