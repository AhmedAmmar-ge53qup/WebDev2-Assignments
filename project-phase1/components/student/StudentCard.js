import React, { useEffect, useState } from 'react'
import { Paper, Typography, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function StudentCard(props) {
    const parent = props.parent
    const student = props.student
    const [role, setRole] = useState("");

    const staffQuery = useQuery(["staff"], async () => {
        const res = await fetch(`/api/staff`);
        return await res.json();
      });

    const teacher = staffQuery.data?.data?.find(t => t.staffNo == student?.teacherId);

    useEffect(() => {
        setRole(localStorage.role)
    }, [])



    return (
        <Paper sx={{ p: "15px", width: 0.70, minHeight: "25vh" }}>
            <Box margin="10px"
                sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
                justifyContent="space-around"
                alignItems="center"
                rowGap={3}
            >
                <Typography variant="h11" component="div">
                    Student ID: {student?.studentId}
                </Typography>
                <Typography variant="h11" component="div">
                    Name: {student?.firstName} {student?.lastName}
                </Typography>
                <Typography variant="h11" component="div">
                    Date of Birth: {student?.dob}
                </Typography>
                <Typography variant="h11" component="div">
                    Gender: {student?.gender?.toLowerCase() === "m" ? "Male" : "Female"}
                </Typography>
                <Typography variant="h11" component="div" >
                    School Grade: {student?.schoolGrade}
                </Typography>
                <Typography variant="h11" component="div" >

                </Typography>
                {role.toLowerCase() != "parent" &&
                    <>
                        <Typography variant="h11" component="div" >
                            Parent Name: {parent?.firstName} {parent?.lastName}
                        </Typography>
                        <Typography variant="h11" component="div" >
                            Parent Phone Number: {parent?.mobile}
                        </Typography>
                        <Typography variant="h11" component="div" >

                        </Typography>
                    </>
                }
                {role.toLowerCase() != "teacher" &&
                    <>
                        <Typography variant="h11" component="div" >
                            Teacher Name: {teacher?.firstName} {teacher?.lastName}
                        </Typography>
                        <Typography variant="h11" component="div" >
                            Halaqa Name: {teacher?.halaqa}
                        </Typography>
                        <Typography variant="h11" component="div" >

                        </Typography>
                    </>
                }
            </Box>
        </Paper>
    )
}
